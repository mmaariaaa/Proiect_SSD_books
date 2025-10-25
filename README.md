# Proiect_SSD_books

### A Web Application for Tracking, Sharing, and Reviewing Books & Movies



##  Project Description

**Proiect_SSD_Books** is a web application that allows users to search for **books and movies**, add them to their personal **watchlist or reading list**, **share progress**, and **write reviews**.  
The platform is designed to encourage discovery and engagement through user interaction and progress tracking.

Users can:
- Search for movies (via **OMDb API**) and books (via **Google Books API**)
- View detailed information for each item
- Add items to a personal list (to-watch / to-read)
- Track progress (e.g., pages read, movies watched)
- Share reviews and ratings
- Explore recommendations from other users

---

##  Team Members



 Student 1  Authentication & User Profiles 
 
 Student 2  Search & API Integration 
 
 Student 3  Reviews & Progress Tracking 

---

## Actors in the System



 **User**  Can register, log in, search for items, manage lists, and review content. 
 **System (App)**  Handles user data, API requests (OMDb / Google Books), stores reviews and progress. 
 **External APIs**  OMDb API and Google Books API provide data for movies and books. 

---

##  Use Cases

Below are the initial **sea-level use cases** for the application (more will be added as the project evolves):

---

### **Use Case 1 – Search for Movies/Books**

**Primary Actor:** User  
**Goal:** Find movies or books by title.  
**Interacting with the System:**
1. The user enters a title in the search bar and submits.  
2. The system queries OMDb (for movies) or Google Books (for books).  
3. The system displays paginated search results with title, year, and cover images.  

---

### **Use Case 2 – View Item Details**

**Primary Actor:** User  
**Goal:** Inspect full details of a selected title.  
**Interacting with the System:**
1. The user clicks on a movie or book from the search results.  
2. The app displays details such as title, description, author/director, year, and rating.  

---

### **Use Case 3 – Add Item to Personal List**

**Primary Actor:** User  
**Goal:** Save a book or movie to a personal watch/read list.  
**Interacting with the System:**
1. User clicks “Add to List”.  
2. System stores the item in the user’s list in Firestore.  
3. Confirmation message appears; item is now visible in the user’s list page.  

---

### **Use Case 4 – Track Reading/Watching Progress**

**Primary Actor:** User  
**Goal:** Update progress on a saved book or movie.  
**Interacting with the System:**
1. User selects an item from their list.  
2. Enters progress (e.g., “page 150” or “1h watched”).  
3. System updates the stored progress in the database.  

---

### **Use Case 5 – Review a Book/Movie**

**Primary Actor:** User  
**Goal:** Write a review or rate an item.  
**Interacting with the System:**
1. User selects an item.  
2. Enters a rating and text review.  
3. System saves the review and displays it under the item’s details page.  

---

### **Use Case 6 – View Other Users’ Reviews**

**Primary Actor:** User  
**Goal:** Explore reviews written by other users.  
**Interacting with the System:**
1. User visits the item details page.  
2. System loads all reviews for that item from the database.  
3. Reviews are displayed in chronological order with usernames and ratings.  

---

### **Use Case 7 – Register and Log In**

**Primary Actor:** User  
**Goal:** Access personalized features through authentication.  
**Interacting with the System:**
1. User registers using email/password or Google login.  
2. System authenticates using Firebase Authentication.  
3. Upon success, user is redirected to their dashboard.  

---

### **Use Case 8 – Share Progress**

**Primary Actor:** User  
**Goal:** Share current progress on a book/movie with other users.  
**Interacting with the System:**
1. User updates progress and clicks “Share Progress”.  
2. System posts progress update to a shared activity feed.  
3. Other users can view and comment on the post.  

---

### **Use Case 9 – Receive Notifications**

**Primary Actor:** User  
**Goal:** Get notified about interactions.  
**Interacting with the System:**
1. Another user comments on or likes the user’s review.  
2. The system sends a real-time notification or email using Firebase Functions.  

