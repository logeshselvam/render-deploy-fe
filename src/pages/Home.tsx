import { Helmet } from 'react-helmet-async';


function HomePage() {
    return <>
      <Helmet>
        <title>Jonathan Lopez – Senior Frontend Engineer</title>
        <meta
          name="description"
          content="Portfolio of Jonathan Arturo López de la Garza, Senior Frontend Engineer specialized in React, TypeScript, and enterprise-grade UI."
        />
      </Helmet>
      <main>
      </main>
      <footer className="text-center py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} AI - Gamblers. All rights reserved.
      </footer>
    </>
}

export default HomePage;
