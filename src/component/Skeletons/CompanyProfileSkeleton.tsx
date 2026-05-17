"use client";

import React from "react";
import { Card, Skeleton, Row, Col } from "antd";

export default function CompanyProfileSkeleton() {
    return (
        <div className="p-2">
            <div className="max-w-6xl mx-auto">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={8}>
                        <Card className="rounded-2xl shadow-md border-0">
                            <div className="flex items-center gap-4">
                                <Skeleton.Avatar active size={80} shape="circle" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton.Input active style={{ width: "60%" }} />
                                    <div style={{ height: 8 }} />
                                    <Skeleton.Input active style={{ width: "40%" }} size="small" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <Skeleton active paragraph={{ rows: 3 }} />
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Card className="rounded-2xl shadow-md border-0">
                            <Skeleton active paragraph={{ rows: 6 }} />
                        </Card>

                        <div className="mt-4">
                            <Card className="rounded-2xl shadow-md border-0">
                                <Skeleton active paragraph={{ rows: 4 }} />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
