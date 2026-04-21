"""Test WebSocket by doing a basic HTTP upgrade check using socket"""
import socket

host = "localhost"
port = 8000
path = "/ws/packets"

req = (
    f"GET {path} HTTP/1.1\r\n"
    f"Host: {host}:{port}\r\n"
    "Upgrade: websocket\r\n"
    "Connection: Upgrade\r\n"
    "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
    "Sec-WebSocket-Version: 13\r\n"
    "\r\n"
)

s = socket.create_connection((host, port), timeout=5)
s.sendall(req.encode())
resp = s.recv(4096).decode(errors="replace")
print(resp[:300])
s.close()
