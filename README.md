# assignment-asc
Live Demo https://a6dubey-taskboard.netlify.app/


# 'Sample Login Credentials':
     Username: john123
     password: john12345


# 'Task Board'
This is a simple web application that have create list title, tasks and etc. It also demonstrates dragging and dropping of tasks from one list to another

## Getting Started
To use this application, simply open the **index.html** file in a web browser. You should see a square element and a target element on the webpage. You can drag the square element using your mouse or touch gestures, and drop it on the target element. If the square element overlaps with the target element, the target element will be highlighted.

## Implementation Details
In this app I have designed user task board based on html draggable properties with using NodeJs,
ExpressJs, React and for database I have used Mongodb.
I have covered following things in this web application
1. User can login with id and password - User and Password in DB
2. A user can create multiple lists - lists should be saved in DB
3. He can drag task from one list to another and data should be saved in database too.
4. When user move task to another list then it should update list id in task in DB
5. User can scroll multiple list horizontally
6. User can mark Task completed and it will be removed from the list
