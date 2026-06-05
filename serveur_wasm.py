import http.server
import socketserver

# Ce code force Python à bien lire la 3D
Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map['.wasm'] = 'application/wasm'

with socketserver.TCPServer(("", 8000), Handler) as httpd:
    print("Serveur 3D prêt sur http://localhost:8000")
    httpd.serve_forever()