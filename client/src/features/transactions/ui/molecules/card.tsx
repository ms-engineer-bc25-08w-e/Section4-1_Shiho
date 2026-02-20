import type { ReactNode } from "react" // Reactの子要素を扱う際の型の1つ

type Props = {
    children: ReactNode;
};

export default function Card({children}:Props){
    return(
        // rounded-xl:角を丸くする、bg-white:背景色白、dark:bg-slate-800青みダークグレー shadow-sm、薄い影をつける(カード感)、border:枠線表示、border-slate-200:薄グレー枠線、p-6:内側の余白（padding）
        <div className="rounded -x1 bg-white dark:bg-slate-800 border border-slate-200 p-6 shadow-sm">
            {children}
        </div>
    );
}