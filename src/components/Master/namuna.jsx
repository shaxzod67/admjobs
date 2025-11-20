import React, { useEffect, useState } from "react";
import { Table, Select, Button, notification } from "antd";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const { Option } = Select;

function Namuna() {
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

  // ==============================
  // BALL SAQLASH (CHEKLOVSIZ)
  // ==============================
  const saveBall = async (item) => {
    const docRef = doc(db, "blogs", item.id);
    let updated = {};

    if (item.tempBall1) updated.ball1 = item.tempBall1;
    if (item.tempBall2) updated.ball2 = item.tempBall2;
    if (item.tempBall3) updated.ball3 = item.tempBall3;

    // O‘rtacha ballni hisoblash
    const b1 = updated.ball1 ?? item.ball1;
    const b2 = updated.ball2 ?? item.ball2;
    const b3 = updated.ball3 ?? item.ball3;

    if (b1 != null && b2 != null && b3 != null) {
      updated.avg = (b1 + b2 + b3) / 3;
    }

    await updateDoc(docRef, updated);
    notification.success({ message: "Ball saqlandi!" });
    getData();
  };

  const rowClassName = (record) =>
    record.avg != null ? (record.avg >= 3.5 ? "green-row" : "red-row") : "";

  return (
    <>
      <Table dataSource={Blog} rowKey="id" rowClassName={rowClassName}>
        <Table.Column title="F.I.SH" dataIndex="fish" />
        <Table.Column title="Bo‘lim" dataIndex="bolim" />
        <Table.Column title="Lavozim" dataIndex="lavozim" />

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

        <Table.Column
          title="Ball 2"
          render={(item) =>
            item.ball2 ? (
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
            )
          }
        />

        <Table.Column
          title="Ball 3"
          render={(item) =>
            item.ball3 ? (
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
            )
          }
        />

        <Table.Column
          title="O‘rtacha Ball"
          render={(item) => (item.avg ? <b>{item.avg.toFixed(2)}</b> : "---")}
        />

        <Table.Column
          title="Saqlash"
          render={(item) => (
            <Button type="primary" onClick={() => saveBall(item)}>
              Saqlash
            </Button>
          )}
        />
      </Table>

      <style>
        {`
          .green-row { background: #d9f7be !important; }
          .red-row { background: #ffa39e !important; }
        `}
      </style>
    </>
  );
}

export default Namuna;
