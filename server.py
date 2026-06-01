import anthropic
import base64
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key=os.environ.get('CLAUDE_API_KEY'))

@app.route('/api/analyze', methods=['POST'])
def analyze():
    file = request.files.get('image')
    if not file:
        return jsonify({'error': '画像がありません'}), 400

    image_data = base64.standard_b64encode(file.read()).decode('utf-8')
    media_type = file.content_type

    message = client.messages.create(
        model='claude-opus-4-5',
        max_tokens=1024,
        messages=[{
            'role': 'user',
            'content': [
                {
                    'type': 'image',
                    'source': {
                        'type': 'base64',
                        'media_type': media_type,
                        'data': image_data,
                    },
                },
                {
                    'type': 'text',
                    'text': 'この料理画像からレシピ名、材料、作り方を日本語で教えてください。JSONのみ返してください。形式: {"name": "...", "ingredients": "...", "steps": "..."}'
                }
            ],
        }]
    )

    text = message.content[0].text
    recipe = json.loads(text.replace('```json', '').replace('```', '').strip())
    return jsonify({'recipe': recipe})

if __name__ == '__main__':
    app.run(port=5001)