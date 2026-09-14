# Personal Homepage

A bilingual, responsive personal academic homepage built for GitHub Pages. It uses plain HTML, CSS, and JavaScript and requires no build step.

## Personalize

1. Update profile text and publication records in `content.js`.
2. Update links in the `contact` object at the top of `content.js`.
3. Put the CV in `assets/` and set its path in the `contact.cv` field. The CV button stays hidden while this field is empty.
4. Replace `assets/mince-li-original.jpg` when a new homepage portrait is ready, or update the image path in `index.html`.

## Preview locally

Run a local web server from this folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a public GitHub repository named `limince.github.io`.
2. Upload the contents of this folder to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Visit `https://limince.github.io` after deployment finishes.

For a custom domain, enter it under **Settings → Pages → Custom domain**, then configure the DNS records at your domain registrar.
