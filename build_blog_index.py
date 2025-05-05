import os
import glob
from bs4 import BeautifulSoup
from datetime import datetime

POSTS_DIR = 'posts'
BLOG_INDEX_FILE = 'blog.html'
POST_DATE_FORMAT = '%b %d, %Y' # Example: Oct 26, 2024

def extract_post_data(filepath):
    """Extracts title, date, and link from a post HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')

            title_tag = soup.find('h1', class_='post-full-title')
            date_tag = soup.find('p', class_='post-full-date')
            # Try finding title in <title> tag as fallback
            if not title_tag:
                title_tag = soup.find('title')
                if title_tag:
                    # Clean up title if taken from <title>
                    title = title_tag.string.split('|')[0].strip() if '|' in title_tag.string else title_tag.string.strip()
            else:
                title = title_tag.string.strip() if title_tag.string else 'Untitled'
            
            date_str = date_tag.string.strip() if date_tag and date_tag.string else None
            
            if not title or not date_str:
                print(f"Warning: Could not find title or date in {filepath}. Skipping.")
                return None

            # Parse date for sorting
            try:
                date_obj = datetime.strptime(date_str, POST_DATE_FORMAT)
            except ValueError:
                print(f"Warning: Could not parse date '{date_str}' in {filepath} using format '{POST_DATE_FORMAT}'. Skipping.")
                return None

            # Generate link relative to root
            link = f"/{POSTS_DIR}/{os.path.basename(filepath)}"

            # Extract custom excerpt from meta tag
            excerpt_meta_tag = soup.find('meta', attrs={'name': 'excerpt'})
            full_excerpt = excerpt_meta_tag['content'].strip() if excerpt_meta_tag and 'content' in excerpt_meta_tag.attrs else ''
            
            # Truncate excerpt if longer than 75 chars
            TRUNCATE_LIMIT = 75
            if len(full_excerpt) > TRUNCATE_LIMIT:
                excerpt = full_excerpt[:TRUNCATE_LIMIT] + '...'
            else:
                excerpt = full_excerpt

            return {
                'title': title,
                'date_obj': date_obj,
                'date_str': date_str,
                'link': link,
                'excerpt': excerpt # Add excerpt here
            }

    except Exception as e:
        print(f"Error processing file {filepath}: {e}")
        return None

def generate_list_item(post_data):
    """Generates the HTML <li> string for a single blog post."""
    # Include excerpt element
    return f'''
            <li class="blog-post-item">
                 <a href="{post_data['link']}" class="post-link">
                     <div class="post-header">
                         <span class="post-title">{post_data['title']}</span>
                         <span class="post-date">{post_data['date_str']}</span>
                     </div>
                     <p class="post-excerpt">{post_data['excerpt']}</p>
                 </a>
            </li>'''

def main():
    print(f"Looking for posts in '{POSTS_DIR}/'.")
    post_files = glob.glob(os.path.join(POSTS_DIR, '*.html'))
    
    # Don't return early if no posts, still need to clear the list
    # if not post_files:
    #    print("No post files found.")
    #    return

    if post_files:
        print(f"Found {len(post_files)} post files.")
        all_post_data = []
        for filepath in post_files:
            data = extract_post_data(filepath)
            if data:
                all_post_data.append(data)
    else:
        print("No post files found in posts directory.")
        all_post_data = [] # Ensure it's an empty list

    # Sort posts by date, newest first (safe even if list is empty)
    all_post_data.sort(key=lambda p: p['date_obj'], reverse=True)

    # Generate HTML list items (will be empty string if no posts)
    list_items_html = '\n'.join([generate_list_item(post) for post in all_post_data])

    # Update the blog index file
    try:
        with open(BLOG_INDEX_FILE, 'r', encoding='utf-8') as f:
            index_soup = BeautifulSoup(f.read(), 'html.parser')

        list_container = index_soup.find('ul', class_='blog-post-list')
        if not list_container:
            print(f"Error: Could not find '<ul class=\"blog-post-list\">' in {BLOG_INDEX_FILE}.")
            return

        # Always clear existing list items first
        list_container.clear()
        
        # Add new items only if there are any
        if list_items_html:
            new_items_soup = BeautifulSoup(list_items_html, 'html.parser')
            for item in new_items_soup.find_all('li', recursive=False):
                list_container.append(item)
                list_container.append('\n') 

        # Write the updated HTML back to the file REGARDLESS of whether posts were found
        print(f"Attempting to write updated content to {BLOG_INDEX_FILE}...") # DEBUG
        try:
            with open(BLOG_INDEX_FILE, 'w', encoding='utf-8') as f:
                # Use str() instead of prettify() for simpler output
                f.write(str(index_soup))
            print(f"Successfully wrote to {BLOG_INDEX_FILE}.") # DEBUG
        except Exception as write_error:
            print(f"Error writing to {BLOG_INDEX_FILE}: {write_error}") # DEBUG
            return # Stop if writing failed
        
        if all_post_data:
            print(f"Successfully updated {BLOG_INDEX_FILE} with {len(all_post_data)} posts.")
        else:
            print(f"Successfully cleared post list in {BLOG_INDEX_FILE} as no posts were found.")

    except FileNotFoundError:
        print(f"Error: {BLOG_INDEX_FILE} not found.")
    except Exception as e:
        print(f"Error updating {BLOG_INDEX_FILE}: {e}")

if __name__ == "__main__":
    main() 