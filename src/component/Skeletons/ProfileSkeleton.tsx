import { Row, Col, Card, Skeleton, Space, Divider } from "antd";

const ProfileSkeleton = () => {
    return (
        <div style={{ minHeight: "100vh", padding: "20px" }}>
            <Row gutter={[24, 24]}>
                {/* Sidebar Skeleton */}
                <Col xs={24} lg={9}>
                    <Card className="rounded-xl">
                        <Space direction="vertical" style={{ width: "100%" }} size="large">
                            <div className="flex items-center gap-4">
                                <Skeleton.Avatar active size={72} shape="circle" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton title={{ width: '60%' }} paragraph={{ rows: 1, width: '40%' }} active />
                                </div>
                            </div>
                            <Divider className="!my-2" />
                            <Skeleton paragraph={{ rows: 4, width: ['100%', '80%', '90%', '70%'] }} active />
                            <Divider className="!my-2" />
                            <Skeleton paragraph={{ rows: 2, width: ['40%', '40%'] }} active />
                        </Space>
                    </Card>
                </Col>

                {/* Main Content Skeleton */}
                <Col xs={24} lg={15}>
                    <Space direction="vertical" style={{ width: "100%" }} size="large">
                        {/* Score Card Skeleton */}
                        <Card className="rounded-xl">
                            <Skeleton active paragraph={{ rows: 1 }} title={{ width: '30%' }} />
                        </Card>

                        {/* Resume Upload Skeleton */}
                        <Card className="rounded-xl">
                            <Skeleton active avatar={{ shape: 'square' }} title={{ width: '40%' }} paragraph={{ rows: 1 }} />
                        </Card>

                        {/* Sections Skeleton (Experience, Education, etc.) */}
                        {[1, 2].map((i) => (
                            <Card key={i} title={<Skeleton.Button active size="small" style={{ width: 120 }} />} className="rounded-xl">
                                <Skeleton active paragraph={{ rows: 3 }} />
                                <Divider />
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </Card>
                        ))}
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default ProfileSkeleton;