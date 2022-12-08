import { Button, Col, Form, message, Row, Typography } from "antd";
import Input from "antd/es/input/Input";
import FileSaver from "file-saver";
import JsZip from "jszip";
import { useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import { Cell } from "read-excel-file/types";
import "./App.css";
import TemplateFile from "./assets/mass-rename.xlsx";

type Mapping = {
  [x: string]: {
    name: Cell;
    ext: Cell;
  };
}[];
function App() {
  const [templateFile, setTemplateFile] = useState<File | undefined>();
  const [rows, setRows] = useState<any[]>([]);
  const [sourceFiles, setSourceFiles] = useState<FileList | null>();
  const [prefix, setPrefix] = useState("");

  useEffect(() => {
    if (templateFile) {
      readXlsxFile(templateFile).then((rows) => setRows(rows));
    }
  }, [templateFile]);

  const mappings = rows.reduce((acc, row, index) => {
    if (index > 1) {
      acc[row[0]] = { name: row[1], ext: row[2] };
    }
    return acc;
  }, {});

  const reset = () => {
    window.location.reload();
  };

  const convert = () => {
    const zip = JsZip();
    if (!sourceFiles) return;

    try {
      Array.from(sourceFiles).forEach((file, i) => {
        const [currentName, currentExt] = file.name.split(".");
        const { name: mappingName, ext: mappingExt } =
          mappings[currentName] || {};
        const name = mappingName ?? currentName;
        const ext = mappingExt ?? currentExt;

        console.log("file", mappings[currentName]);
        console.log("currentExt", currentExt);
        console.log("mappingExt", mappingExt);

        const blob = new Blob([file], { type: `image/${ext}` });

        zip.file(`${prefix}${name}.${ext}`, blob);
      });

      zip
        .generateAsync({ type: "blob" })
        .then((zipFile) => {
          const currentDate = new Date().getTime();
          const fileName = `results-${currentDate}.zip`;

          return FileSaver.saveAs(zipFile, fileName);
        })
        .then(() => reset());
    } catch (error) {
      console.log(error);
      message.error("Bị lỗi gì rồi, đi hỏi Minh đi");
    }
  };

  return (
    <div className="App" style={{ padding: "0 32px" }}>
      <Typography.Title style={{ textAlign: "center" }}>
        Mass File Rename
      </Typography.Title>
      <Row justify="space-between" style={{ margin: "32px 0" }}>
        <Col
          span={7}
          style={{
            border: "1px solid #e9e9e9",
            borderRadius: 8,
            padding: "16px 24px",
          }}
        >
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Step 1: Name mapping configuration
          </Typography.Title>
          <Typography.Paragraph>
            Configure how you want to change the name of your files through our
            template excel file (click the link below to download)
          </Typography.Paragraph>
          <Button href={TemplateFile} download>
            Download template
          </Button>

          <Typography.Paragraph style={{ marginTop: 16 }}>
            Then upload your excel file here
          </Typography.Paragraph>

          <input
            style={{ display: "block", marginTop: 20 }}
            type="file"
            onChange={(e) => setTemplateFile(e.target.files?.[0])}
          />
        </Col>
        <Col
          span={7}
          style={{
            border: "1px solid #e9e9e9",
            borderRadius: 8,
            padding: "16px 24px",
          }}
        >
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Step 2: Upload your source files
          </Typography.Title>

          <input
            type="file"
            multiple
            onChange={(e) => setSourceFiles(e.target.files)}
          />
        </Col>

        <Col
          span={7}
          style={{
            border: "1px solid #e9e9e9",
            borderRadius: 8,
            padding: "16px 24px",
          }}
        >
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Step 3: Options
          </Typography.Title>
          <Form.Item label="Prefix">
            <Input
              type="text"
              placeholder="PREFIX_yourfilename"
              onChange={(e) => setPrefix(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ width: "100%", textAlign: "center", marginTop: 40 }}>
        <Button
          style={{ width: 250 }}
          size="large"
          type="primary"
          onClick={convert}
        >
          Convert
        </Button>
      </div>
    </div>
  );
}

export default App;
