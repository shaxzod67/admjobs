// BossPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, notification } from "antd";
import { db } from "../../firebase";
import "./BossPage.css";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";

function BossPage() {
  const [data, setData] = useState([]);

  // --- BOSS PAGE MA'LUMOTLARNI OLIB KELISH ---
  const getBossData = async () => {
    const querySnapshot = await getDocs(collection(db, "bossPage"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(items);
  };

  useEffect(() => {
    getBossData();
  }, []);

  // --- BOSSLARNING QABUL QILISH / QAYTARISH FUNKSIYASI ---
  const handleDecision = async (item, passed) => {
    const docRef = doc(db, "bossPage", item.id);

    // ⏱ HOZIRGI KUN / OY / YIL / VAQT
    const now = new Date();
    const sana = now.toLocaleDateString("uz-UZ");
    const vaqt = now.toLocaleTimeString("uz-UZ");

    let hrData;

    if (passed) {
      // ✔ TASDIQLANDI
      hrData = {
        fish: item.fish,
        bolim: item.bolim,
        lavozim: item.lavozim,
        ball1: item.ball1,
        ball2: item.ball2,
        ball3: item.ball3,
        avg: item.avg,
        result:
          item.avg >= 3.5
            ? "Sinov muddatidan muvaffaqiyatli o'tdi"
            : "Sinov muddatidan o‘ta olmadi",
        sana: sana,
        vaqt: vaqt,
        status: "Tasdiqlandi"
      };

      notification.success({
        message: "Natija HR ga yuborildi!",
      });

    } else {
      // ❗ QAYTA KO‘RILSIN
      hrData = {
        fish: item.fish,
        bolim: item.bolim,
        lavozim: item.lavozim,
        ball1: item.ball1,
        ball2: item.ball2,
        ball3: item.ball3,
        avg: item.avg,
        result: "Qayta ko‘rilsin",
        sana: sana,
        vaqt: vaqt,
        status: "Qayta ko‘rilsin"
      };

      notification.info({
        message: "Qayta ko‘rish HRga yuborildi!",
      });
    }

    // HR PAGE GA YUBORISH
    await addDoc(collection(db, "hrPage"), hrData);

    // BossPage’dagi submitted flag = true
    await updateDoc(docRef, { submitted: true });

    getBossData();
  };

  // --- YASHIL / QIZIL RANG ---
  const rowClassName = (record) => {
    if (record.avg != null) return record.avg >= 3.5 ? "green-row" : "red-row";
    return "";
  };

  return (
    <>
      <h2>Boss Page</h2>

      <Table
        dataSource={data.filter((d) => !d.submitted)}
        rowKey="id"
        rowClassName={rowClassName}
        pagination={false}
      >
        <Table.Column title="F.I.SH" dataIndex="fish" />
        <Table.Column title="Bo‘lim" dataIndex="bolim" />
        <Table.Column title="Lavozim" dataIndex="lavozim" />
        <Table.Column title="1 - oy" dataIndex="ball1" />
        <Table.Column title="2 - oy" dataIndex="ball2" />
        <Table.Column title="3 - oy" dataIndex="ball3" />
        <Table.Column
          title="Meyoriy o'tish balli"
          render={(item) => (item.avg ? <b>{item.avg.toFixed(2)}</b> : "---")}
        />

        <Table.Column
          title="Amallar"
          render={(item) => (
            <>
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={() => handleDecision(item, true)}
              >
                Tasdiqlayman
              </Button>

              <Button danger onClick={() => handleDecision(item, false)}>
                Qayta ko‘rilsin
              </Button>
            </>
          )}
        />
      </Table>

      <style>
        {`
          .green-row { background: #0BDA51 !important; }
          .red-row { background: #FF3131 !important; }
        `}
      </style>
    </>
  );
}

export default BossPage;
