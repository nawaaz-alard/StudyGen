# How to Deploy Your Life Science Quiz Site

Your project is now a refined **Progressive Web App (PWA)**. Here is how to put it online for free.

## Option 1: GitHub Pages (Recommended)
Since your code is likely already in a GitHub repository (`Life-science-quiz-site`), this is the easiest method.

1.  **Push your changes** to GitHub:
    ```bash
    git add .
    git commit -m "Final version with PWA and Interactivity"
    git push
    ```
2.  Go to your Repository on GitHub.com.
3.  Go to **Settings** > **Pages**.
4.  Under **Branch**, select `main` (or `master`) and Click **Save**.
5.  Wait a minute, and GitHub will verify your site.
6.  Your URL will be `https://<your-username>.github.io/Life-science-quiz-site/`.

## Option 2: Netlify (Drag & Drop)
If you don't want to use Git commands:

1.  Go to [Netlify.com](https://www.netlify.com).
2.  Sign up/Login.
3.  Drag the entire `Life-science-quiz-site` folder onto the "Sites" area.
4.  It will deploy instantly.

## PWA Features (Install App)
Once deployed (served over HTTPS), you will see an **"Install"** icon in your browser address bar (Chrome/Edge) or "Add to Home Screen" on mobile.

- **Offline Support**: The site will work even without internet after the first visit.
- **Full Screen**: It launches like a native app without the browser UI.
