from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_core import get_answer

app = Flask(__name__)
CORS(app) #Allows our Node.js server to call this API

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/ask", methods=["POST"]) # a decorator, is followed by a function
def ask():
    data = request.get_json()
    question = data.get("question")
    if not question:
        return jsonify({"error": "Question is required"}), 400
    
    answer = get_answer(question)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    print("Starting server...")
    app.run(host="0.0.0.0", port=5000, debug=True)