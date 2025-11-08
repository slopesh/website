import ExperienceCard from "@/components/ExperienceCard";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Experience() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <section id='experience' className="max-w-4xl w-full flex flex-col mx-auto">
                <motion.h1
                    className="text-center font-bold text-5xl mt-16 -mb-2"
                    initial={{ transform: 'translateY(-30px)', opacity: 0 }}
                    whileInView={{ transform: 'translateY(0px)', opacity: 100 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.39, 0.21, 0.12, 0.96], }}
                    viewport={{ amount: 0.1, once: true }}
                >
                    Experience
                </motion.h1>
                <ul className={`flex flex-col pt-6 pb-1 gap-4 overflow-hidden`}>
                    <ExperienceCard
                        url="https://ranoz.gg"
                        title="Ranoz"
                        fullDescription={[
                            "Ranoz.gg started as a quick fix for a problem: sharing any file, anywhere, as fast as possible—no nonsense, no hidden steps, no aggressive popups. It's built to work exactly how you'd hope: drag, drop, link, done. Pretty much everything is engineered for speed. If something breaks, I patch it. If an upload's slow, I upgrade the pipes.",
                            "Behind the scenes, it's a mashup of everyday tech (nothing top-secret), deployed across a couple fast servers and locked behind decent security. Cloudflare shields it from weird traffic, and there's real attention to uptime. Bugs get squashed as soon as they pop up—no waiting for \"the next release.\"",
                            "Users? Everyone from students, modders, server owners, teachers, random gamers, all passing stuff around when Discord starts complaining about file sizes. Honestly, if you use it, you're probably the reason half the new features exist—I just ship what people ask for if it makes sense and it's doable.",
                            "There's no story about \"disrupting the cloud\" or \"revolutionizing sharing.\" It's just a tool that's always getting tuned up and pushed forward—no drama, no \"roadmaps,\" just stuff that works. If you want a place to toss files around with zero friction, welcome aboard."
                        ]}
                        cardImage="https://i.imgur.com/M88xZgN.png"
                        cardDescription="Ranoz.gg started as a quick fix for a problem: sharing any file, anywhere, as fast as possible—no nonsense, no hidden steps, no aggressive popups. It's built to work exactly how you'd hope: drag, drop, link, done."
                        media={["https://i.imgur.com/p8UyNxr.mp4"]}
                        myRole="Founder & Developer"
                        timeline="August 2024 - Present"
                        delay={0.1}
                        gradient="bg-gradient-to-br"
                    />
                </ul>
            </section>
        </>
    );
}
