import { FormEvent, useState } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";

import appPreviewImg from "../assets/app-nwl-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarImg from "../assets/user-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../adapters/apiAdapter";

type HomeProps = {
    poolCount: number;
    guessCount: number;
    userCount: number;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    try {
        const [poolCountResponse, guessCountResponse, userCountResponse] =
            await Promise.all([
                api.get("/pools/count"),
                api.get("/guesses/count"),
                api.get("/users/count"),
            ]);

        return {
            props: {
                poolCount: poolCountResponse.data.count,
                guessCount: guessCountResponse.data.count,
                userCount: userCountResponse.data.count,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                poolCount: 0,
                guessCount: 0,
                userCount: 0,
            },
        };
    }
};

const Home = ({
    poolCount,
    guessCount,
    userCount,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [poolTitle, setPoolTitle] = useState("");

    const createPool = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const poolResponse = await api.post("/pools", {
                title: poolTitle,
            });

            setPoolTitle("");

            const { code } = poolResponse.data;

            await navigator.clipboard.writeText(code);

            alert(
                `Bolão criado com sucesso! Código copiado para área de transferência.`
            );
        } catch (error) {
            console.log(error);
            alert("Falha ao criar o bolão, tente novamente!");
        }
    };

    return (
        <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
            <main>
                <Image src={logoImg} alt="Logo principal do NWL Copa" />
                <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </h1>
                <div className="mt-10 flex items-center gap-2">
                    <Image
                        src={usersAvatarImg}
                        alt="Exemplo de fotos de participantes do NWL Copa"
                    />
                    <strong className="text-gray-100 text-xl">
                        <span className="text-ignite-500">+{userCount}</span>{" "}
                        pessoas já estão usando
                    </strong>
                </div>

                <form onSubmit={createPool} className="mt-10 flex gap-2">
                    <input
                        className="flex-1 px-6 py-4 rounded text-gray-100 bg-gray-800 border border-gray-600 text-sm"
                        type="text"
                        placeholder="Qual nome do seu Bolão?"
                        required
                        onChange={(event) => setPoolTitle(event.target.value)}
                        value={poolTitle}
                    />
                    <button
                        className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
                        type="submit"
                    >
                        Criar meu bolão
                    </button>
                </form>

                <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                    Após criar seu bolão, você receberá um código único que
                    poderá usar para convidar outras pessoas 🚀
                </p>

                <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
                    <div className="flex items-center gap-6">
                        <Image src={iconCheckImg} alt="" />
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">
                                +{poolCount}
                            </span>
                            <span>Bolões criados</span>
                        </div>
                    </div>
                    <div className="w-px h-14 bg-gray-600"></div>
                    <div className="flex items-center gap-6">
                        <Image src={iconCheckImg} alt="" />
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">
                                +{guessCount}
                            </span>
                            <span>Palpites enviados</span>
                        </div>
                    </div>
                </div>
            </main>
            <Image
                src={appPreviewImg}
                alt="Dois celulares exibindo uma prévia da aplicação móvel do NWL Copa 2022"
                quality={100}
            />
        </div>
    );
};

export default Home;
