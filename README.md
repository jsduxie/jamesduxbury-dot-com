# jamesduxbury-dot-com

This repo contains the source code for my personal portfolio website. This website was built using Next.js, Typescript and Tailwindcss.

The website can be accessed via this [link][https://jamesduxbury-dot-com.vercel.app]!

## Technologies
Next.js
TypeScript
Tailwindcss
Nodemailer for sending me the contact form details

## Project Structure
All files reside in the `jamesduxbury` directory. Within this, are the following files/folders:
- src
    - app
        - components
            - ui
                - ui.tsx: implementation for contact form features from DialogPrimitive
            - Components.tsx: main bulk of components, including nav bar and hero banner
            - Contact.tsx: contact form implementation
            - Education.tsx: education section implementation
            - Experience.tsx: experience section implementation
            - Projects.tsx: projects section implementation
        - api
            - contact/route.ts: backend implementation of contact form
- public
    - images: image assets
    - certifications.json: stores certification information, including links, names and badge images
    - CV.pdf: a copy of my CV
    - projects.json: stores project information

## Installation
Clone the repository:
``` Bash
git clone https://github.com/jsduxie/jamesduxbury-dot-com
```

Install the required packages:
``` Bash
cd jamesduxbury
npm install
```

## Usage
To run the project in development mode:
``` Bash
npm run dev
```

To build the project, and run:
``` Bash
npm run build
npm start
```

## License
Feel free to use this code, but please reference and like this repo :)