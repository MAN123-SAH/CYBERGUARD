import hashlib
import urllib.request
import urllib.error

class PasswordService:
    def check_pwned_api(self, password: str) -> int:
        """
        Hashes password with SHA-1 and uses k-Anonymity to check if it's been breached.
        Only sends the first 5 characters of the hash over the network.
        Returns the number of times it appeared in breaches (0 if safe).
        """
        # Hash password in SHA-1
        sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
        
        # Split for k-Anonymity
        prefix = sha1_hash[:5]
        suffix = sha1_hash[5:]
        
        # Query Have I Been Pwned API
        url = f"https://api.pwnedpasswords.com/range/{prefix}"
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'CyberGuard-Phishing-System'})
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    hashes = (line.decode('utf-8').split(':') for line in response)
                    for h, count in hashes:
                        if h == suffix:
                            return int(count.strip())
            return 0
        except urllib.error.URLError as e:
            print(f"Error querying Pwned Passwords API: {e}")
            # If the API is unreachable, we fail gracefully to 0 or raise Exception. For now, return 0.
            return 0

password_service = PasswordService()
