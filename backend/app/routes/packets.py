import asyncio
import random
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

PROTOCOLS = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "ICMP", "SSH", "FTP"]
INFOS = ["SYN", "ACK", "SYN-ACK", "FIN", "GET /", "POST /api", "DNS Query", "ICMP Echo"]

def generate_packet(id_counter: int):
    return {
        "id": id_counter,
        "timestamp": datetime.now().strftime("%H:%M:%S.%f")[:-3], # HH:MM:SS.mmm
        "srcIp": f"192.168.1.{random.randint(1, 254)}",
        "dstIp": f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}",
        "protocol": random.choice(PROTOCOLS),
        "length": random.randint(60, 1500),
        "info": random.choice(INFOS)
    }

@router.websocket("/ws/packets")
async def packet_stream(websocket: WebSocket):
    await websocket.accept()
    packet_id = 0
    try:
        while True:
            # Send a packet every ~0.8 seconds (matching the speed of the frontend prototype)
            await asyncio.sleep(0.8)
            packet = generate_packet(packet_id)
            packet_id += 1
            await websocket.send_json(packet)
    except WebSocketDisconnect:
        print("Client disconnected from packet stream")
    except Exception as e:
        print(f"Packet stream error: {e}")
