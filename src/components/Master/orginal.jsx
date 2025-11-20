import React, { useEffect, useState } from "react";
import { Table, Select, Button, notification } from "antd";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";

const { Option } = Select;

function Master() {
  const [Blog, setBlog] = useState([]);
  const ballOptions = [1, 2, 3, 4, 5];

  const getData = async () => {
    const dataBase = await getDocs(collection(db, "blogs"));
    const itemslist = dataBase.docs.map((dc) => ({
      id: dc.id,
      ...dc.data(),
    }));
    setBlog(itemslist);
  };

  useEffect(() => {
    getData();
  }, []);

  // =============================
  // 🔥 BALL SAQLASH 30 KUN CHEKLOVI
  // =============================
  const saveBall = async (item) => {
    const docRef = doc(db, "blogs", item.id);
    const today = new Date();
    let updated = {};

    try {
      // BALL 1
      if (!item.ball1) {
        updated.ball1 = item.tempBall1;
        updated.ball1Date = today.toISOString();
      }
      // BALL 2
      else if (item.ball1 && !item.ball2) {
        const diff = (today - new Date(item.ball1Date)) / (1000 * 3600 * 24);
        if (diff < 30) {
          return notification.error({
            message: `Ball 2 ni qo‘yish uchun ${30 - Math.floor(diff)} kun qoldi`,
          });
        }
        updated.ball2 = item.tempBall2;
        updated.ball2Date = today.toISOString();
      }
      // BALL 3
      else if (item.ball2 && !item.ball3) {
        const diff = (today - new Date(item.ball2Date)) / (1000 * 3600 * 24);
        if (diff < 30) {
          return notification.error({
            message: `Ball 3 ni qo‘yish uchun ${30 - Math.floor(diff)} kun qoldi`,
          });
        }
        updated.ball3 = item.tempBall3;
        updated.ball3Date = today.toISOString();
        // Umumiy ball hisoblash
        const avg = (item.ball1 + item.ball2 + updated.ball3) / 3;
        updated.avg = avg;
      }

      await updateDoc(docRef, updated);
      notification.success({ message: "Ball saqlandi!" });
      getData();
    } catch (err) {
      console.error(err);
      notification.error({ message: "Xatolik yuz berdi" });
    }
  };

  // =============================
  // 🔥 YUBORISH BOSS PAGE
  // =============================
  const submitToBoss = async () => {
    const completed = Blog.filter((b) => b.ball1 && b.ball2 && b.ball3);

    if (completed.length === 0) {
      return notification.warning({ message: "Yuborish uchun balli yetganlar yo‘q!" });
    }

    for (let item of completed) {
      await addDoc(collection(db, "bossPage"), {
        fish: item.fish,
        bolim: item.bolim,
        lavozim: item.lavozim,
        ball1: item.ball1,
        ball2: item.ball2,
        ball3: item.ball3,
        avg: item.avg,
        submittedAt: new Date().toISOString(),
      });
    }

    notification.success({ message: "Ma’lumotlar Boss page ga yuborildi!" });
  };

  // ================================
  // Qator rangini belgilash
  // ================================
  const rowClassName = (record) => {
    if (record.avg != null) {
      return record.avg >= 3.5 ? "green-row" : "red-row";
    }
    return "";
  };

  return (
    <>
      <Table dataSource={Blog} rowKey="id" rowClassName={rowClassName}>
        <Table.Column title="F.I.SH" dataIndex="fish" />
        <Table.Column title="Bo‘lim" dataIndex="bolim" />
        <Table.Column title="Lavozim" dataIndex="lavozim" />

        {/* BALL 1 */}
        <Table.Column
          title="Ball 1"
          render={(item) =>
            item.ball1 ? (
              <span>{item.ball1}</span>
            ) : (
              <Select
                placeholder="Ball 1"
                style={{ width: 80 }}
                onChange={(v) => (item.tempBall1 = v)}
              >
                {ballOptions.map((b) => (
                  <Option key={b} value={b}>
                    {b}
                  </Option>
                ))}
              </Select>
            )
          }
        />

        {/* BALL 2 */}
        <Table.Column
          title="Ball 2"
          render={(item) => {
            if (!item.ball1) return <span style={{ color: "#aaa" }}>—</span>;
            return item.ball2 ? (
              <span>{item.ball2}</span>
            ) : (
              <Select
                placeholder="Ball 2"
                style={{ width: 80 }}
                onChange={(v) => (item.tempBall2 = v)}
              >
                {ballOptions.map((b) => (
                  <Option key={b} value={b}>
                    {b}
                  </Option>
                ))}
              </Select>
            );
          }}
        />

        {/* BALL 3 */}
        <Table.Column
          title="Ball 3"
          render={(item) => {
            if (!item.ball2) return <span style={{ color: "#aaa" }}>—</span>;
            return item.ball3 ? (
              <span>{item.ball3}</span>
            ) : (
              <Select
                placeholder="Ball 3"
                style={{ width: 80 }}
                onChange={(v) => (item.tempBall3 = v)}
              >
                {ballOptions.map((b) => (
                  <Option key={b} value={b}>
                    {b}
                  </Option>
                ))}
              </Select>
            );
          }}
        />

        {/* O‘RTACHA BALL */}
        <Table.Column
          title="O‘rtacha Ball"
          render={(item) => (item.avg ? <b>{item.avg.toFixed(2)}</b> : "---")}
        />

        {/* SAQLASH */}
        <Table.Column
          title="Saqlash"
          render={(item) => (
            <Button type="primary" onClick={() => saveBall(item)}>
              Saqlash
            </Button>
          )}
        />
      </Table>

      {/* YUBORISH TUGMASI */}
      {Blog.some((b) => b.ball1 && b.ball2 && b.ball3) && (
        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={submitToBoss}
        >
          Yuborish Boss Page
        </Button>
      )}

      <style>
        {`
          .green-row { background: #d9f7be !important; }
          .red-row { background: #ffa39e !important; }
        `}
      </style>
    </>
  );
}

export default Master;
