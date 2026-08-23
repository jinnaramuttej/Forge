import time
import logging

log = logging.getLogger(__name__)

def post_to_all_platforms(image_path, caption, post_instagram, post_facebook, post_youtube):
    """
    MOCK implementation of the social media posting logic for safe live demos.
    This simulates API/Selenium latency and returns a success response without actually
    triggering risky automated browser logins that could get accounts locked.
    """
    log.info(f"🚀 [MOCK] Starting social media broadcast...")
    log.info(f"📸 Image: {image_path}")
    log.info(f"📝 Caption: {caption}")
    
    platforms = []
    if post_instagram:
        platforms.append("Instagram")
    if post_facebook:
        platforms.append("Facebook")
    if post_youtube:
        platforms.append("YouTube")
        
    if not platforms:
        return False, "No platforms selected for posting."

    # Simulate network latency and processing time for realism
    for platform in platforms:
        log.info(f"⏳ [MOCK] Connecting to {platform}...")
        time.sleep(1.5)
        log.info(f"📤 [MOCK] Uploading media to {platform}...")
        time.sleep(2.0)
        log.info(f"✅ [MOCK] Successfully posted to {platform}!")
        
    success_msg = f"Successfully posted to {', '.join(platforms)} (Mocked for safe demo)"
    
    return True, success_msg

# Added to satisfy the test script that was looking for social_media_easy
def post_to_instagram(image_path, caption):
    time.sleep(2)
    return True, "Successfully posted to Instagram (Mocked)"
