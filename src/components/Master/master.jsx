// Master.jsx
import React, { useEffect, useState } from "react";
import { Table, Select, Button, notification, Popconfirm } from "antd";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";

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

  // Ball saqlash
  const saveBall = async (item) => {
    const docRef = doc(db, "blogs", item.id);
    const now = new Date();
    let updated = {};

    try {
      if (!item.ball1) {
        updated.ball1 = item.tempBall1;
        updated.ball1Date = now.toISOString();
      } else if (item.ball1 && !item.ball2) {
        const diffSec = (now - new Date(item.ball1Date)) / 1000;
        if (diffSec < 5) {
          return notification.error({
            message: `Ball 2 ni qo‘yish uchun ${Math.ceil(5 - diffSec)} soniya qoldi`,
          });
        }
        updated.ball2 = item.tempBall2;
        updated.ball2Date = now.toISOString();
      } else if (item.ball2 && !item.ball3) {
        const diffSec = (now - new Date(item.ball2Date)) / 1000;
        if (diffSec < 5) {
          return notification.error({
            message: `Ball 3 ni qo‘yish uchun ${Math.ceil(5 - diffSec)} soniya qoldi`,
          });
        }
        updated.ball3 = item.tempBall3;
        updated.ball3Date = now.toISOString();
      }

      await updateDoc(docRef, updated);
      notification.success({ message: "Ball saqlandi!" });
      getData();
    } catch (err) {
      console.error(err);
      notification.error({ message: "Xatolik yuz berdi" });
    }
  };

  // Boss page ga yuborish
  const submitToBoss = async () => {
    const completed = Blog.filter((b) => b.ball1 && b.ball2 && b.ball3);

    if (!completed.length) {
      return notification.warning({
        message: "Yuborish uchun balli yetganlar yo‘q!",
      });
    }

    for (let item of completed) {
      const avg = (item.ball1 + item.ball2 + item.ball3) / 3;

      await addDoc(collection(db, "bossPage"), {
        fish: item.fish,
        bolim: item.bolim,
        lavozim: item.lavozim,
        ball1: item.ball1,
        ball2: item.ball2,
        ball3: item.ball3,
        ball1Date: item.ball1Date,
        ball2Date: item.ball2Date,
        ball3Date: item.ball3Date,
        avg: avg,
        submittedAt: new Date().toISOString(),
      });
    }

    notification.success({ message: "Ma’lumotlar Boss page ga yuborildi!" });

    getData();
  };

  // O‘chirish tugmasi
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      notification.success({ message: "Ro‘yxat o‘chirildi!" });
      getData();
    } catch (err) {
      console.error(err);
      notification.error({ message: "Xatolik yuz berdi!" });
    }
  };

  // Row ranglari
  const rowClassName = (record) => {
    if (record.ball1 && record.ball2 && record.ball3) {
      const avg = (record.ball1 + record.ball2 + record.ball3) / 3;
      return avg >= 3.5 ? "green-row" : "red-row";
    }
    return "";
  };

  const allCompleted = Blog.every((b) => b.ball1 && b.ball2 && b.ball3);

  return (
    <>
      <Table dataSource={Blog} rowKey="id" rowClassName={rowClassName}>
        <Table.Column title="F.I.SH" dataIndex="fish" />
        <Table.Column title="Bo‘lim" dataIndex="bolim" />
        <Table.Column title="Lavozim" dataIndex="lavozim" />

        <Table.Column
          title="1 - oy"
          render={(item) =>
            item.ball1 ? (
              <>
                <span>{item.ball1}</span>
                <br />
                <small>{item.ball1Date ? new Date(item.ball1Date).toLocaleString("uz-UZ") : "---"}</small>
              </>
            ) : (
              <Select
                style={{ width: 80 }}
                placeholder="Ball 1"
                onChange={(v) => (item.tempBall1 = v)}
              >
                {ballOptions.map((b) => (
                  <Option key={b} value={b}>{b}</Option>
                ))}
              </Select>
            )
          }
        />

        <Table.Column
          title="2 - oy"
          render={(item) =>
            item.ball2 ? (
              <>
                <span>{item.ball2}</span>
                <br />
                <small>{item.ball2Date ? new Date(item.ball2Date).toLocaleString("uz-UZ") : "---"}</small>
              </>
            ) : (
              <Select
                style={{ width: 80 }}
                placeholder="Ball 2"
                onChange={(v) => (item.tempBall2 = v)}
              >
                {ballOptions.map((b) => (
                  <Option key={b} value={b}>{b}</Option>
                ))}
              </Select>
            )
          }
        />

        <Table.Column
          title="3 - oy"
          render={(item) =>
            item.ball3 ? (
              <>
                <span>{item.ball3}</span>
                <br />
                <small>{item.ball3Date ? new Date(item.ball3Date).toLocaleString("uz-UZ") : "---"}</small>
              </>
            ) : (
              <Select
                style={{ width: 80 }}
                placeholder="Ball 3"
                onChange={(v) => (item.tempBall3 = v)}
              >
                {ballOptions.map((b) => (
                  <Option key={b} value={b}>{b}</Option>
                ))}
              </Select>
            )
          }
        />

        <Table.Column
          title="Umumiy Ball"
          render={(item) =>
            item.ball1 && item.ball2 && item.ball3
              ? <b>{((item.ball1 + item.ball2 + item.ball3)/3).toFixed(2)}</b>
              : "---"
          }
        />

        <Table.Column
          title="Saqlash"
          render={(item) => (
            <Button type="primary" onClick={() => saveBall(item)}>Saqlash</Button>
          )}
        />

        <Table.Column
          title="O'chirish"
          render={(item) =>
            item.ball3 ? (
              <Popconfirm
                title="Haqiqatan o‘chirmoqchimisiz?"
                onConfirm={() => handleDelete(item.id)}
                okText="Ha"
                cancelText="Yo‘q"
              >
                <Button danger>O‘chirish</Button>
              </Popconfirm>
            ) : null
          }
        />
      </Table>

      {allCompleted && (
        <Button type="primary" style={{ marginTop: 20 }} onClick={submitToBoss}>
          Yuborish Boss page
        </Button>
      )}

      <style>
        {`
          .green-row { background: #4FE35E !important; }
          .red-row { background: #FF4747 !important; }
        `}
      </style>
    </>
  );
}

export default Master;
