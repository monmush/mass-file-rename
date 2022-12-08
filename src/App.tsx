import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  message,
  Row,
  Tag,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import Input from "antd/es/input/Input";
import Dragger from "antd/es/upload/Dragger";
import FileSaver from "file-saver";
import JsZip from "jszip";
import { useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import "./App.css";
import TemplateFile from "./assets/mass-rename.xlsx";

const SEO_KEYWORDS = [
  "Renaming Files Online",
  "Bulk File Renamed",
  "How to rename multiple files",
  "Rename Multiple Files with Excel Data",
  "How to rename multiple files with Excel file name mapping",
  "Rename Files Online Tool",
  "File Name Mapping Tool",
  "Rename Multiple Files with Excel Data",
  "Rename Multiple Files with Excel Data and Mappings",
  "How to rename multiple files from Excel data",
];
function App() {
  const [templateFile, setTemplateFile] = useState<File | undefined>();
  const [rows, setRows] = useState<any[]>([]);
  const [sourceFiles, setSourceFiles] = useState<File[] | null>();
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

  const rename = () => {
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
      message.error("Something went wrong");
    }
  };

  const mockRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const templateUploadProps: UploadProps = {
    customRequest: mockRequest,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setTemplateFile(info.file.originFileObj);
        message.success(`Template uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const sourceFileUploadProps: UploadProps = {
    customRequest: mockRequest,
    multiple: true,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setSourceFiles(
          info.fileList.map((file) => file.originFileObj) as unknown as File[]
        );
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="App" style={{ padding: "0 32px" }}>
      <div style={{ textAlign: "center" }}>
        <Typography.Title style={{ textAlign: "center" }}>
          Mass File Rename
        </Typography.Title>
        <Typography.Paragraph>
          This tool allow you to rename multiple files. Support name mapping
          from excel file (.xlsx)
        </Typography.Paragraph>
      </div>
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
            Step 1: Let us know how do you want to change the file names
          </Typography.Title>
          <Typography.Paragraph>
            First, let's configure through this excel template file
          </Typography.Paragraph>

          <Button href={TemplateFile} download>
            Download template
          </Button>

          <Typography.Paragraph style={{ marginTop: 16 }}>
            Then upload the template with your configurations here
          </Typography.Paragraph>

          <Upload {...templateUploadProps}>
            <Button icon={<UploadOutlined />}>Upload the template here</Button>
          </Upload>
        </Col>
        <Col
          span={9}
          style={{
            border: "1px solid #e9e9e9",
            borderRadius: 8,
            padding: "16px 24px",
          }}
        >
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Step 2: Upload your source files
          </Typography.Title>

          <Dragger height="auto" {...sourceFileUploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Upload your files here</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload
            </p>
          </Dragger>
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
          <Form layout="vertical">
            <Form.Item label="Prefix">
              <Input
                type="text"
                placeholder="PREFIX_yourfilename"
                onChange={(e) => setPrefix(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>

      <div style={{ width: "100%", textAlign: "center", marginTop: 40 }}>
        <Button
          style={{ width: 250 }}
          size="large"
          type="primary"
          onClick={rename}
        >
          Rename
        </Button>
      </div>

      <section style={{ width: "60%", margin: "54px auto" }}>
        <Typography.Paragraph>
          How to rename files with Excel data Renaming a group of files can be
          tiresome and time-consuming. However, there are ways to simplify the
          process. One way is by using an Excel spreadsheet that contains the
          file names you want to rename and their desired new names. This will
          allow you to rename all the files at once in bulk without having to
          select each one individually. For this method, follow these steps:
        </Typography.Paragraph>
        <Typography.Paragraph>
          <ol>
            <li>
              Download template our template file, which allows you to configure
              the current file names and the desired new names. Please delete
              all the sample data and replace with your. Then, insert the list
              of your current file names, and their new names. You can also
              change the file extension if needed
            </li>
            <li>Upload list of files that you want to rename in the Step 2</li>
            <li>
              If you need an option to add name prefix for each and every files,
              config it in the Step 3
            </li>
            <li>Click the Rename button and let us do the job &#128521;</li>
          </ol>
          Note: If you can't upload files through the browser, it might related
          to permission control within your device
        </Typography.Paragraph>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SEO_KEYWORDS.map((keyword) => (
            <Tag key={keyword}>{keyword}</Tag>
          ))}
        </div>
      </section>

      <div style={{ textAlign: "center" }}>
        <Typography.Text type="secondary">
          @ Developed by Minh. Email me at: minh.pham.developer@gmail.com
        </Typography.Text>
      </div>
    </div>
  );
}

export default App;
