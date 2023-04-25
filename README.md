<a name="readme-top"></a>

[![LinkedIn][linkedin-shield]][linkedin-url]
[![WWW][www-shield]][www-url]

<br />
<div align="center">
  <h3 align="center"><strong>piotrdoniak.com</strong></h3>
  <p align="center">
    Personal blog and portfolio website.
    <br />
    <a href="https://piotrdoniak.com?utm_source=github&utm_medium=hero&utm_campaign=piotrdoniak.com"><strong>Check out the page</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## **About The Project**

[![Homepage screenshot][homepage-screenshot]](https://piotrdoniak.com?utm_source=github&utm_medium=screenshot&utm_campaign=piotrdoniak.com)

This project is designed to serve my portfolio/blog page hosted on my website [piotrdoniak.com](https://piotrdoniak.com?utm_source=github&utm_medium=about&utm_campaign=piotrdoniak.com). I want to share my thoughts, projects, and networking activities with others. With this project, I can showcase my professional and personal accomplishments to potential employers, clients, and collaborators.

Overall, this portfolio/blog page project represents my commitment to showcasing my skills, sharing my experiences, and building my network.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### **Built With**

[![Vercel][Vercel]][Vercel-url]
[![Next][Next.js]][Next-url]
[![Tailwind][Tailwind]][Tailwind-url]
[![Prisma][Prisma]][Prisma-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## **Getting Started**

You can clone this repository and run it locally. To get a local copy up and running follow these simple steps.

### **Setup your environment**

Clone the repository and install the dependencies.

```bash
git clone https://github.com/boleknowak/piotrdoniak.com.git

cd piotrdoniak.com

npm install
# or
yarn install
# or
pnpm install
```

### **Set up the database**

This project uses PostgreSQL as its database.
You can set up a local database or use a remote one.
You will need DATABASE_URL environment variable to connect to the database.

Move `.env.example` to `.env` and fill in the variables.

```bash
mv .env.example .env
```

Example `.env` file:

```bash
# Application
APP_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=GA-XXXXXXXXXX
NEXT_PUBLIC_TINYMCE_API_KEY=
NEXT_PUBLIC_FILE_UPLOAD_URL=
NEXT_PUBLIC_FILE_DOWNLOAD_URL=
NEXT_PUBLIC_FILE_NAME=
DISCORD_WEBHOOK_URL=

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="<very-secret-string>"
GOOGLE_ID=
GOOGLE_SECRET=

# Database
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=blog
DB_USERNAME=your-name
DB_PASSWORD=your-super-secret-password
DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public"
```

Note: DATABASE_URL: The full database connection URL. This is required and is used by prisma.


### **Prisma Setup**

This project uses Prisma as its ORM. You can find more information about Prisma [here](https://www.prisma.io/).

Use the following command to generate the Prisma client:

```bash
npx prisma migrate dev
```

View the database diagram [here](https://github.com/boleknowak/piotrdoniak.com/blob/main/prisma/ERD.md).

### **Getting Google OAuth API Credentials**

1. Visit the [Google Cloud Console](https://console.developers.google.com/apis/credentials)
2. Go to the OAuth consent screen tab, fill first step leaving the rest blank and click Save. This will create a project for you.
3. Now Publish your OAuth consent screen App.
4. Go to the [Credentials tab](https://console.cloud.google.com/apis/credentials) and click Create Credentials -> OAuth Client ID.
   - Choose Web Application
   - Add `http://localhost:3000` to the Authorized JavaScript origins
   - Add `http://localhost:3000/api/auth/callback/google` to the Authorized redirect URIs
   - Click Create
5. Copy the Client ID and Client Secret and paste them into the `.env` file.

```bash
GOOGLE_ID=your_client_id
GOOGLE_SECRET=your_client_secret
```

### **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Add Posts Section
- [ ] Add Calendar functionality
- [ ] Add Newsletter

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, feel free to fork the repo and create a pull request. You can also simply open an issue.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the [MIT License](https://choosealicense.com/licenses/mit/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Piotr Doniak - [hello@piotrdoniak.com](mailto:hello@piotrdoniak.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [boring-avatars](https://www.npmjs.com/package/boring-avatars)
* [Chakra UI](https://chakra-ui.com/)
* [eslint](https://eslint.org/)
* [Font Awesome](https://fontawesome.com)
* [Img Shields](https://shields.io)
* [Next.js](https://nextjs.org/)
* [NextAuth.js](https://next-auth.js.org/)
* [next-absolute-url](https://www.npmjs.com/package/next-absolute-url)
* [next-sitemap](https://www.npmjs.com/package/next-sitemap)
* [nprogress](https://www.npmjs.com/package/nprogress)
* [prettier](https://prettier.io/)
* [Prisma](https://www.prisma.io/)
* [prisma-erd-generator-markdown](https://www.npmjs.com/package/prisma-erd-generator-markdown)
* [react-hot-toast](https://react-hot-toast.com/)
* [react-icons](https://react-icons.github.io/react-icons/)
* [react-spinners](https://www.npmjs.com/package/react-spinners)
* [redis](https://www.npmjs.com/package/ioredis)
* [slugify](https://www.npmjs.com/package/slugify)
* [Tailwind CSS](https://tailwindcss.com/)
* [TinyMCE](https://www.tiny.cloud/)
* [Vercel](https://vercel.com/)
* [zod](https://www.npmjs.com/package/zod)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=0a66c2
[linkedin-url]: https://linkedin.com/in/piotrdoniak
[www-shield]: https://img.shields.io/badge/-WWW-black.svg?style=for-the-badge&logo=rss&colorB=073551
[www-url]: https://piotrdoniak.com?utm_source=github&utm_medium=shield&utm_campaign=piotrdoniak.com
[homepage-screenshot]: https://piotrdoniak.com/images/brand/homepage.png

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Vercel]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
[Tailwind]: https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
