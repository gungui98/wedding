# resize all images in folder to the same width and keep the aspect ratio as the original image
import os
import cv2

def resize_images(folder_path, target_width):
    print(folder_path)
    for filename in os.listdir(folder_path):
        print(filename)
        if filename.endswith(('.JPG', '.jpg', '.jpeg', '.png', '.gif', '.bmp')):
            img_path = os.path.join(folder_path, filename)
            img = cv2.imread(img_path)
            if img is None:
                print(f"Failed to load image: {img_path}")
                continue
            height, width = img.shape[:2]
            aspect_ratio = width / height
            new_height = int(target_width / aspect_ratio)
            resized_img = cv2.resize(img, (target_width, new_height))
            cv2.imwrite(img_path, resized_img, [cv2.IMWRITE_JPEG_QUALITY, 96])
            print(f"Resized image: {img_path}")

# Example usage
folder_path = './assets/gallery'
target_width = 1920
resize_images(folder_path, target_width)



