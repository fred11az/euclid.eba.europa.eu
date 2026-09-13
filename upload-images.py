#!/usr/bin/env python3
"""Simple HTTP server to upload director images"""

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json

class ImageUploadHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        """Handle image uploads"""
        if self.path == '/upload':
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)

            # Parse multipart form data
            boundary = self.headers['Content-Type'].split("boundary=")[1].encode()
            parts = body.split(b'--' + boundary)

            for part in parts:
                if b'filename=' in part:
                    # Extract filename
                    filename_start = part.find(b'filename="') + 10
                    filename_end = part.find(b'"', filename_start)
                    filename = part[filename_start:filename_end].decode()

                    # Extract file content
                    content_start = part.find(b'\r\n\r\n') + 4
                    content_end = part.rfind(b'\r\n')
                    content = part[content_start:content_end]

                    # Save file
                    output_dir = 'public/images/directors'
                    os.makedirs(output_dir, exist_ok=True)
                    filepath = os.path.join(output_dir, filename)

                    with open(filepath, 'wb') as f:
                        f.write(content)

                    print(f"✓ Uploaded: {filename}")

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status": "ok"}')
        else:
            super().do_GET()

if __name__ == '__main__':
    os.chdir('/home/user/euclid.eba.europa.eu')
    server = HTTPServer(('localhost', 8000), ImageUploadHandler)
    print("🚀 Server running on http://localhost:8000")
    print("Drag & drop images to upload!")
    server.serve_forever()
