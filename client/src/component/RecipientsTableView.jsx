/* eslint-disable react/prop-types */
import { Button, Form, Modal, notification, QRCode, Select, Table, Typography } from "antd";
import _ from "lodash";
import { Link } from "react-router-dom";
import { IconHelper, UrlHelper } from "../helper/Icon_helper";
import { useEffect, useState } from "react";
import { MdQrCode2 } from "react-icons/md";
import { addMoreRecipients, client_url, resendAllMails } from "../helper/api_helper";

const RecipientsTableView = ({ tableData, from, row, restData, fetchData, setExpandView }) => {
  const [open, setOpen] = useState(false);

  const [selectedMails, setSelectedMails] = useState([]);

  const [addMore, setAddMore] = useState(false);

  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Recipients",
      dataIndex: "gmail",
    },
    {
      title: "Actions",
      dataIndex: "link",
      align: "center",
      render: (data, all) => {
        return (
          <div className="flex items-center gap-x-6 justify-center">
            <MdQrCode2
              className="!text-[16px] text-primary cursor-pointer"
              onClick={() => {
                setOpen(all);
              }}
            />
            <Typography.Paragraph
              copyable={{
                text: `${client_url}${data}`,
              }}
              className="pt-4"
            ></Typography.Paragraph>

            <Link target="_blank" to={`${client_url}${data}`}>
              <IconHelper.clickLink className={`text-secondary !text-[12px]`} />
            </Link>
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedMails.map((res) => {
      return res.link;
    }),
    onChange: (_, selectedRows) => {
      setSelectedMails(selectedRows);
      form.resetFields();
      setAddMore(false);
    },
  };

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    setSelectedMails([]);
    setAddMore(false);
  }, []);

  const handleResenAllEmails = async () => {
    try {
      setLoading(true);
      let formData = {
        file_id: restData._id,
        user_id: restData.user_id,
        client_url: client_url,
      };

      if (!_.isEmpty(selectedMails)) {
        formData.resend_mails = selectedMails;
      } else {
        formData.resend_mails = tableData;
      }

      await resendAllMails(formData);
      handleFinishORCancel();
      notification.success({ message: "Mail sent successfully" });
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleFinishORCancel = () => {
    form.resetFields();
    setSelectedMails([]);
    setAddMore(false);
    setExpandView([]);
  };

  const handleAddMoreEmail = async (values) => {
    try {
      setLoading(true);
      let formData = {
        file_id: restData._id,
        user_id: restData.user_id,
        client_url: client_url,
      };
      formData.trackgmail = values.recipient_email?.map((res) => {
        return {
          link: UrlHelper(),
          gmail: res,
        };
      });
      await addMoreRecipients(formData);
      notification.success({
        message: "Recipient Added And Mail sent successfully",
      });
      handleFinishORCancel();
      fetchData();
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancellAdd = () => {
    try {
      form.resetFields();
      setSelectedMails([]);
      setAddMore(false);
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        pagination={false}
        dataSource={from ? tableData : _.get(tableData, "data.all", [])}
        size="small"
        rowSelection={row ? rowSelection : false}
        rowKey={(result) => {
          return result.link;
        }}
        className={`${from ? "!w-[600px]" : ""}`}
      />
      <div className="flex flex-col py-6">
        {!_.isEmpty(selectedMails) && <h1 className="text-sm font-Poppins">Selected Emails : {selectedMails?.length}</h1>}

        <div className="flex items-center gap-x-4">
          {!_.isEmpty(selectedMails) && (
            <Button loading={loading} className="primary_btn mt-4 !w-[200px] !text-white" onClick={handleResenAllEmails}>
              {"Resend Email"}
            </Button>
          )}
          {addMore && (
            <Form layout="vertical" onFinish={handleAddMoreEmail} form={form}>
              <Form.Item
                label="Select Recipient Email"
                name="recipient_email"
                rules={[
                  {
                    required: true,
                    message: "Please add/select a recipient email",
                  },
                ]}
              >
                <Select virtual={false} mode="tags" className="antd_input  !min-h-[10px] !w-[640px] focus:!border-none hover:border-none" tokenSeparators={[","]} placeholder="Select Recipient Email"></Select>
              </Form.Item>

              <div className="flex justify-start gap-x-10">
                <Form.Item>
                  <Button loading={loading} block className="primary_btn !w-[150px]" htmlType="submit">
                    Add Recipient
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loading}
                    onClick={() => {
                      handleCancellAdd();
                    }}
                    block
                    className="primary_btn !bg-transparent !text-primary !w-[150px]"
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </div>
            </Form>
          )}
          {row && !addMore && (
            <Button
              loading={loading}
              onClick={() => {
                setAddMore(true);
                setSelectedMails([]);
              }}
              className="primary_btn !border-primary bg-transparent mt-4 !w-[200px] !text-primary"
            >
              {"Add More Recipients"}
            </Button>
          )}
        </div>
      </div>
      <Modal
        open={open.gmail}
        title={open.gmail}
        onCancel={() => {
          setOpen(false);
        }}
        width={350}
        closable={false}
        footer={false}
      >
        <QRCode className="!w-[300px] !h-[300px]" value={`${client_url}${open.link}`} />
      </Modal>
    </div>
  );
};

export default RecipientsTableView;
