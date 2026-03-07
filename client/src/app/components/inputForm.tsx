"use client";

import { useEffect,useMemo,useState } from "react";
import type { Transaction,Draft, Category } from "@/features/transactions/types/transaction";
import TransactionFormView from "@/features/transactions/ui/Templates/transactionFormView";
import { apiFetch } from "@/features/transactions/api/apiClient";

type AddProps = {
  mode?: "add"; // 省略したらadd扱い
  onAdded: (created: Transaction) => void; // created用
  onDraftChange?: (draft: Draft) => void; // useEffect用　今は使用するかわからないから任意(?)とする　入力途中のDraftをAppに通知等
};

type EditProps = {
  mode: "edit";
  detailDraft: Transaction; //詳細が渡す既存データ
  onSave: (draft: Draft) => void | Promise<void>;
  onDraftChange?: (draft: Draft) => void;
};

type Props = AddProps | EditProps;

// 型ガード（propsがedit側かどうか判定）
function isEditProps(p: Props): p is EditProps {
  return p.mode === "edit";
}

const TransactionForm = (props:Props) => {
    const today = useMemo(() => new Date().toISOString().slice(0,10),[]); //構文：useMemo(() => 値を計算するロジック, 依存配列);

    const mode = props.mode ?? "add";
    
    const [categories, setCategories] = useState<Category[]>([]);
    
    const [formDraft,setDraft] = useState<Draft>(() => {
        if (isEditProps(props)){
            const {id, ...rest} = props.detailDraft; //id以外をrestへ代入
            return rest;
        }
        return{
            date:today,
            type:"expense",
            categoryId:"",
            categoryName:"",
            title:"",
            amount:0,
        }
});

    //editIDの型をstringまたはnullとし、初期値をnullとする
    //stringはmode === "edit"の時props.detailDraft.idが入る=編集対象のidがある場合にstring、無ければnullになる
    const editID = isEditProps(props) ? props.detailDraft.id : null;

    useEffect(() => {
    if (!isEditProps(props)) return;
    const { id, ...rest } = props.detailDraft;
    setDraft(rest);
    }, [editID, props]);


    useEffect (() => {
        if (mode !== "add")return ; //editの時は下の処理をしない
        props.onDraftChange?.(formDraft)},[formDraft,props.onDraftChange,mode]); //Appから渡されたonDraftChange関数を子inputForm.tsxが呼び出しフォーム全体の現在の入力状態（formDraft）を引数としてAppに渡す。今後使うか

    const update = <K extends keyof Draft> (key:K,value:Draft[K])=> { //K extends keyof Draft:KはDraftのキーのどれか1つでなければならない制約つき型変数
        setDraft((prev) => ({...prev,[key]:value})) //(prev):更新前のDraft。Reactが最新の状態を渡してくれる。　{...Prev｝：既存の値を全てコピー。　[key]:value:Keyの値だけ上書きする
    };

    // カテゴリ一覧を取得
    useEffect(() => {
        (async () => {
            const items = await apiFetch<Category[]>("/categories");
            setCategories(items);
        })();
    }, []);


//React.FormEvent<HTMLFormElement>:HTML<form>タグのイベント
const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {

    // ★チェック用
    console.log("handleSubmit called");

    evt.preventDefault(); //preventDefault：自動リロード防止


  try {

    // editはonSave
    if(isEditProps(props)) {
        await props.onSave(formDraft);
        return;
    }

    // addはPOST
    if (!formDraft.categoryId) {
        alert("カテゴリを選択してください");
        return;
    }

    // ここでDBにPOSTする
    const created = await apiFetch<Transaction>("/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: formDraft.date,
        type: formDraft.type,
        categoryId: formDraft.categoryId,
        title: formDraft.title,
        amount: formDraft.amount,
      }),
    });


    // 入金一覧即時更新（
    const cat = categories.find((c) => c.id === formDraft.categoryId);

    props.onAdded({ ...created, categoryName: cat?.name ?? "" });


    // //今の状態をコピーしてカテゴリ、メモ、金額を初期化
    setDraft((prev) => ({
      ...prev,
      categoryId: "",
      title: "",
      amount: 0,
    }));

    // 登録できているかわからないのでアラート入れる
    alert(`登録OK: ${created.id}`);

  } catch (e) {
    console.error(e);
    alert("登録に失敗しました（Consoleを確認してください）");
  }
};

// データや関数を渡してTransactionFormViewにフォーム表示を任せる
return(
    <TransactionFormView 
        mode={mode}
        draft={formDraft}
        categories={categories}
        onChange={update}
        onSubmit={handleSubmit}
    />
);
};

export default TransactionForm ;