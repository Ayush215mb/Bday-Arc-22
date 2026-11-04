export default function Greeting({ name }: { name: string }) {
    return (
        <div className="mt-8 mb-4 text-center">
            <h1 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[34px]">
                <span className="block text-white/35">Hi, {name}</span>
                <span className="block text-white">
                    where are we headed now?
                </span>
            </h1>
            <p className="mx-auto mt-3 max-w-[38ch] text-sm leading-snug text-white/35">
                I&apos;m here to plan your trips so that you don&apos;t miss
                anything
            </p>
        </div>
    );
}
