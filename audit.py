import argparse
import csv
import os
import subprocess
import sys
import tempfile
from typing import Dict, Iterable, Tuple

try:
    import regex as re
except ImportError:
    import re


SUPPORTED_EXTS = {'.js', '.ts', '.go', '.py', '.yaml', '.yml'}

def clone_repo(url: str) -> str:
    temp_dir = tempfile.mkdtemp(prefix='audit_repo_')
    subprocess.run(['git', 'clone', '--depth', '1', url, temp_dir], check=True)
    return temp_dir

def iter_files(path: str) -> Iterable[str]:
    for root, dirs, files in os.walk(path):
        for name in files:
            if name == 'Dockerfile':
                yield os.path.join(root, name)
            else:
                ext = os.path.splitext(name)[1].lower()
                if ext in SUPPORTED_EXTS:
                    yield os.path.join(root, name)

def search_targets(path: str, targets: Iterable[str]) -> Dict[str, Tuple[str, int]]:
    patterns = {t: re.compile(re.escape(t), re.IGNORECASE) for t in targets}
    results: Dict[str, Tuple[str, int]] = {t: None for t in targets}  # type: ignore
    for file_path in iter_files(path):
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                for num, line in enumerate(f, 1):
                    for t, pat in patterns.items():
                        if results[t] is None and pat.search(line):
                            results[t] = (file_path, num)
        except Exception:
            continue
        if all(results[t] is not None for t in targets):
            break
    return results

def main() -> int:
    parser = argparse.ArgumentParser(description='Dependency audit tool')
    parser.add_argument('--targets', required=True, help='Space separated list of tech names to search for')
    parser.add_argument('--source', required=True, help='Local path or git URL to inspect')
    parser.add_argument('--output', default='audit_report.csv', help='Path to output CSV')
    args = parser.parse_args()

    targets = args.targets.split()
    source = args.source

    if os.path.exists(source):
        path = source
    elif source.startswith(('http://', 'https://')) or source.endswith('.git'):
        path = clone_repo(source)
    else:
        print(f'Unsupported source: {source}', file=sys.stderr)
        return 1

    results = search_targets(path, targets)

    with open(args.output, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['tool', 'detected', 'file_path', 'line_number'])
        for t in targets:
            if results.get(t):
                file_path, line = results[t]
                writer.writerow([t, 'Y', file_path, line])
            else:
                writer.writerow([t, 'N', '', ''])

    print(f'Results written to {args.output}')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
