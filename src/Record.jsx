import "./App.css";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const Record = () => {
  const [text, setText] = useState("");
  // 初期値は数値の0
  const [time, setTime] = useState(0);
  const [decision, setDecision] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecord] = useState([]);

  const addRecord = async () => {
    // 未入力チェック（timeは数値なのでtime === 0が正しく機能する）
    if (text === "" || time === 0) {
      setDecision(true);
      return;
    } else {
      setDecision(false);
    }

    // Supabase の `insert` を使ってデータを追加
    const { data, error } = await supabase
      .from("study-record")
      .insert([{ title: text, time: time }])
      .select();
    if (error) {
      console.error("データ追加エラー:", error);
      return;
    }
    setRecord((prev) => [...prev, data[0]]);

    // prevを使って最新のStateを安全に参照する
    // setRecord((prev) => [...prev, { title: text, time: time }]);
    // フォームをリセット
    setText("");
    setTime(0);
  };

  const onCLickDelete = async (id) => {
    await supabase.from("study-record").delete().eq("id", id);
    setRecord((prev) => prev.filter((record) => record.id !== id));
  };

  // 保存時に数値化済みなのでNumber()が不要
  const calcTime = records.reduce((a, b) => {
    return a + b.time;
  }, 0);

  const getAllrecords = async () => {
    const { data } = await supabase.from("study-record").select();

    setRecord(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllrecords();
  }, []);

  return (
    <>
      <div>
        {/* タイトル */}
        <h1>学習記録一覧</h1>
        <label htmlFor="content">学習内容</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          id="content"
        />
        <br />
        <label htmlFor="time">学習時間</label>
        {/* Number()で数値に変換してから保存する */}
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          id="time"
        />
        時間
        <p>入力されている学習内容:{text}</p>
        <p>入力されている学習時間:{time}時間</p>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {/* recordsをmapで一覧表示 */}
            {records.map((record) => (
              <li key={record.id}>
                {record.title}：{record.time}時間{" "}
                <button onClick={() => onCLickDelete(record.id)}>削除</button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={addRecord}>登録</button>
        {decision && <p>入力されていない項目があります</p>}
        <p>合計時間:{calcTime}/1000(h)</p>
      </div>
    </>
  );
};
