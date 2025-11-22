// HRPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Input, Select, Popconfirm, notification } from "antd";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import * as XLSX from "xlsx";

const { Option } = Select;

function HRPage() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getHRData = async () => {
    const querySnapshot = await getDocs(collection(db, "hrPage"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(items);
  };

  useEffect(() => {
    getHRData();
  }, []);

  // --- O‘CHIRISH FUNKSIYASI ---
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "hrPage", id));
      notification.success({ message: "Ro‘yxat o‘chirildi!" });
      getHRData();
    } catch (err) {
      console.error(err);
      notification.error({ message: "Xatolik yuz berdi!" });
    }
  };

  const rowClassName = (record) => {
    if (record.avg != null) return record.avg >= 3.5 ? "green-row" : "red-row";
    return "";
  };

  // FILTER + SEARCH + SORT
  const filteredData = data
    .filter((item) =>
      item.fish.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((item) => {
      if (statusFilter === "passed") return item.avg >= 3.5;
      if (statusFilter === "failed") return item.avg < 3.5;
      return true;
    })
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

  const exportToExcel = () => {
    const worksheetData = filteredData.map((item) => ({
      "F.I.SH": item.fish,
      "Bo‘lim": item.bolim,
      "Lavozim": item.lavozim,
      "Ball 1": item.ball1,
      "Ball 2": item.ball2,
      "Ball 3": item.ball3,
      "O‘rtacha Ball": item.avg ? item.avg.toFixed(2) : "",
      "Natija": item.result,
      "Sana/Vaqt": item.submittedAt || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HR Page");
    XLSX.writeFile(workbook, "HR_Page.xlsx");
  };

  return (
    <>
      <h2>HR Page</h2>

      <Input
        placeholder="Qidiruv (F.I.SH)"
        style={{ width: 200, marginRight: 10, marginBottom: 15 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Select
        value={statusFilter}
        style={{ width: 150, marginRight: 10, marginBottom: 15 }}
        onChange={(value) => setStatusFilter(value)}
      >
        <Option value="all">Hammasi</Option>
        <Option value="passed">O‘tganlar</Option>
        <Option value="failed">O‘tolmaganlar</Option>
      </Select>

      <Button type="primary" style={{ marginBottom: 15 }} onClick={exportToExcel}>
        Excelga yuklash
      </Button>

      <Table
        dataSource={filteredData}
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
        <Table.Column title="Natija" dataIndex="result" />
        <Table.Column
          title="Sana/Vaqt"
          dataIndex="submittedAt"
          render={(date) => (date ? new Date(date).toLocaleString("uz-UZ") : "---")}
        />
        <Table.Column
          title="Amallar"
          render={(item) => (
            <Popconfirm
              title="Haqiqatan o‘chirmoqchimisiz?"
              onConfirm={() => handleDelete(item.id)}
              okText="Ha"
              cancelText="Yo‘q"
            >
              <Button danger>O‘chirish</Button>
            </Popconfirm>
          )}
        />
      </Table>

      <style>
        {`
          .green-row { background: #82E02F !important; }
          .red-row { background: #ED857B !important; }
        `}
      </style>
    </>
  );
}

export default HRPage;
