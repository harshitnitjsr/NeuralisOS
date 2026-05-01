import re
paths = ['apps/api/agents/roles/legal.py', 'apps/api/agents/roles/hr.py', 'apps/api/agents/roles/sales.py', 'apps/api/agents/roles/marketing.py']
for path in paths:
    with open(path, 'r') as f: content = f.read()
    content = re.sub(r'def get_([a-z]+)_prompt\(company_name: str, context: str\) -> str:', r'def get_\1_prompt(company_name: str, context: str, memory_context: str) -> str:', content)
    content = content.replace('Company Context: {context}', 'Company Context: {context}\n\nUse the following retrieved context graph and memory equally to provide a fast and better response:\n{memory_context}\n')
    content = content.replace('context = state.get(\'company_context\', \'\')\n    print', 'context = state.get(\'company_context\', \'\')\n    memory_context = state.get(\'memory_context\', \'\')\n    print')
    content = re.sub(r'SystemMessage\(content=get_([a-z]+)_prompt\(company, context\)\)', r'SystemMessage(content=get_\1_prompt(company, context, memory_context))', content)
    with open(path, 'w') as f: f.write(content)
print('Done!')
