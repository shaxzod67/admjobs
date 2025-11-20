import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Table, Button, Modal, Input, Select, notification } from "antd";

const { Option } = Select;

//  BO'LIMLAR
const bolimOptions = [
  "CKD ishlab chiqarish",
  "SKD ishlab chiqarish",
  "Yig‘ish bo‘limi",
  "Sifat nazorati",
  "Logistika",
  "Boshqaruv",
  "Elektr bo‘limi",
  "Mexanika bo‘limi",
  "Texnik xizmat",
  "HR bo‘limi",
];

//  LAVOZIMLAR
const lavozimOptions = [
  "Sifat nazoratchisi",
  "Yig‘uvchi chilangar",
  "TM operatori",
  "Butlovchi",
  "Hisobchi",
  "Ustaxona boshlig‘i",
  "Smena boshlig‘i",
  "Logistika mutaxassisi",
  "Texnik xodim",
  "Operator",
];

function Dashboard() {
  const [Blog, setBlog] = useState([]);
  const [fish, setFish] = useState("");
  const [bolim, setBolim] = useState(null);
  const [lavozim, setLavozim] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // -------------------------------
  // 🔥 GET DATA (READ)
  // -------------------------------
  const getData = async () => {
    const snapshot = await getDocs(collection(db, "blogs"));
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setBlog(list);
  };

  useEffect(() => {
    getData();
  }, []);

  // -------------------------------
  // 🔥 CREATE
  // -------------------------------
  const handleCreate = async () => {
    if (!fish || !bolim || !lavozim) {
      return alert("Malumot qo'shilmadi");
    }

    await addDoc(collection(db, "blogs"), {
      fish,
      bolim,
      lavozim,
    });

    alert("Muvaffaqiyatli qo‘shildi!");

    setFish("");
    setBolim(null);
    setLavozim(null);

    getData();
  };

  // -------------------------------
  // 🔥 DELETE
  // -------------------------------
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "blogs", id));
    alert("Ma'lumot o‘chirildi");

    getData();
  };

  // -------------------------------
  // 🔥 EDIT
  // -------------------------------
  const openEdit = (item) => {
    setCurrentId(item.id);
    setFish(item.fish);
    setBolim(item.bolim);
    setLavozim(item.lavozim);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "blogs", currentId), {
      fish,
      bolim,
      lavozim,
    });

    notification.success({ message: "Ma'lumot yangilandi!" });
    setEditModal(false);

    setFish("");
    setBolim(null);
    setLavozim(null);

    getData();
  };

  return (
    <>
      {/* FORM */}
      <form style={{ marginBottom: 20 }}>
        <Input
          value={fish}
          onChange={(e) => setFish(e.target.value)}
          placeholder="F.I.SH"
          style={{ width: 200, marginRight: 10 }}
        />

        <Select
          value={bolim}
          onChange={(v) => setBolim(v)}
          placeholder="Bo‘limni tanlang"
          style={{ width: 200, marginRight: 10 }}
        >
          {bolimOptions.map((b, i) => (
            <Option key={i} value={b}>
              {b}
            </Option>
          ))}
        </Select>

        <Select
          value={lavozim}
          onChange={(v) => setLavozim(v)}
          placeholder="Lavozimni tanlang"
          style={{ width: 200, marginRight: 10 }}
        >
          {lavozimOptions.map((l, i) => (
            <Option key={i} value={l}>
              {l}
            </Option>
          ))}
        </Select>

        <Button type="primary" onClick={handleCreate}>
          Qo‘shish
        </Button>
      </form>

      {/* TABLE */}
      <Table dataSource={Blog} rowKey="id">
        <Table.Column title="F.I.SH" dataIndex="fish" />
        <Table.Column title="Bo‘lim" dataIndex="bolim" />
        <Table.Column title="Lavozim" dataIndex="lavozim" />

        <Table.Column
          title="Amallar"
          render={(item) => (
            <>
              <Button
                type="primary"
                onClick={() => openEdit(item)}
                style={{ marginRight: 10 }}
              >
                Tahrirlash
              </Button>
              <Button danger onClick={() => handleDelete(item.id)}>
                O‘chirish
              </Button>
            </>
          )}
        />
      </Table>

      {/* EDIT MODAL */}
      <Modal
        title="Ma'lumotni tahrirlash"
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={handleUpdate}
      >
        <Input
          value={fish}
          onChange={(e) => setFish(e.target.value)}
          placeholder="F.I.SH"
          style={{ marginBottom: 10 }}
        />

        <Select
          value={bolim}
          onChange={(v) => setBolim(v)}
          placeholder="Bo‘limni tanlang"
          style={{ width: "100%", marginBottom: 10 }}
        >
          {bolimOptions.map((b, i) => (
            <Option key={i} value={b}>
              {b}
            </Option>
          ))}
        </Select>

        <Select
          value={lavozim}
          onChange={(v) => setLavozim(v)}
          placeholder="Lavozimni tanlang"
          style={{ width: "100%" }}
        >
          {lavozimOptions.map((l, i) => (
            <Option key={i} value={l}>
              {l}
            </Option>
          ))}
        </Select>
      </Modal>

      {/* PLACEHOLDER FIX */}
      <style>
        {`
          .ant-select-selection-placeholder {
            color: #999 !important;
          }
        `}
      </style>
    </>
  );
}

export default Dashboard;
