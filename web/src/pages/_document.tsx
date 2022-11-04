import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=optional"
                    rel="stylesheet"
                />
            </Head>
            <body className="bg-gray-900 bg-app bg-no-repeat bg-cover">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
