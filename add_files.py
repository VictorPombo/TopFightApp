import os
import subprocess

def add_files():
    # Get all untracked files
    try:
        result = subprocess.run(['git', 'ls-files', '--others', '--exclude-standard'], capture_output=True, text=True, timeout=5)
        files = result.stdout.splitlines()
    except Exception as e:
        print(f"Error getting files: {e}")
        # fallback: find files manually ignoring node_modules
        result = subprocess.run(['find', 'apps', '-type', 'f'], capture_output=True, text=True)
        files = result.stdout.splitlines()
        files = [f for f in files if 'node_modules' not in f and '.next' not in f and '.expo' not in f]
    
    print(f"Found {len(files)} files to add.")
    for f in files:
        if not f.strip():
            continue
        try:
            print(f"Adding {f}...", end=" ")
            if os.path.exists('.git/index.lock'):
                os.remove('.git/index.lock')
            subprocess.run(['git', 'add', f], timeout=2, check=True)
            print("OK")
        except subprocess.TimeoutExpired:
            print("TIMEOUT!")
        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == '__main__':
    add_files()
