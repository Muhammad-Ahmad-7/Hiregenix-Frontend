import { DesktopOutlined, EyeOutlined, ThunderboltFilled, WarningFilled } from '@ant-design/icons';
import { Alert, Avatar, Button, Card, List, Typography } from 'antd'
import React from 'react'


const { Title } = Typography;

const ReadyInterviewStatus = ({ logoUrl, companyName, startCameraPreview }: { logoUrl: string; companyName: string; startCameraPreview: () => void }) => {
    return (
        <div className="h-screen flex items-center justify-center bg-[#f0f2f5] p-4">
            <Card className="max-w-[600px] w-full shadow-xl rounded-3xl border-none p-6">
                <div className="text-center mb-8">
                    <Avatar size={64} src={logoUrl} />
                    <Title level={3} className="mt-4 italic text-blue-600">{companyName + " Interview Portal"}</Title>
                </div>

                <Alert
                    message="Strict Interview Rules"
                    description="Refreshing the page or switching tabs will result in immediate disqualification."
                    type="error"
                    showIcon
                    icon={<WarningFilled />}
                    className="mb-8 rounded-xl font-medium"
                />

                <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                    <Title level={5}>Instructions & Warnings:</Title>
                    <List split={false} className="space-y-2">
                        <List.Item className="p-0 border-none"><EyeOutlined className="mr-3 text-blue-500" /> Look directly into the camera lens.</List.Item>
                        <List.Item className="p-0 border-none"><DesktopOutlined className="mr-3 text-blue-500" /> Do not use external aids.</List.Item>
                        <List.Item className="p-0 border-none"><WarningFilled className="mr-3 text-red-500" /> Everything is recorded.</List.Item>
                    </List>
                </div>

                <Button type="primary" size="large" block onClick={startCameraPreview}
                    icon={<ThunderboltFilled />} className="h-14 rounded-xl text-lg bg-blue-600 font-bold hover:scale-[1.02] transition-transform">
                    Check Device Setup
                </Button>
            </Card>
        </div>
    )
}

export default ReadyInterviewStatus
