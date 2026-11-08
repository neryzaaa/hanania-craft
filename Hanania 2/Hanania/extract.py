import json
import re

def extract_app():
    pattern = re.compile(r'(const\s+App\s*=\s*\(\)\s*=>\s*\{|function\s+App\s*\(\)\s*\{)')
    with open(r'C:\Users\khoir\.gemini\antigravity-ide\brain\501d0b65-afd7-422b-b43b-60c481113b8c\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if 'content' in data:
                    content = data['content']
                    lines = content.split('\n')
                    for i, l in enumerate(lines):
                        if pattern.search(l):
                            print("FOUND IN TRANSCRIPT:")
                            print("\n".join(lines[i:i+40]))
                            return
            except Exception as e:
                pass

extract_app()
