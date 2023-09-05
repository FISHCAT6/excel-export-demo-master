// 简单 demo
import React, {useEffect, useState} from 'react'
import {Button, Card, message, Space, Table} from "antd";
import {ColumnsType} from "antd/lib/table/interface";
import * as ExcelJs from 'exceljs';
import {generateHeaders, saveWorkbook} from "../utils";
import {StudentInfo} from "../types";

interface SimpleDemoProps {
}

const SimpleDemo: React.FC<SimpleDemoProps> = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [list, setList] = useState<StudentInfo[]>([]);

    useEffect(() => {
        generateData();
    }, [])

    function generateData() {
        let arr: StudentInfo[] = [];
        for (let i = 0; i < 100000; i++) {
            arr.push({
                id: i,
                province: "山西省",
                area: "太原市",
                career: "预算员",
                name: `小明${i}号`,
                state: '已处理',
                rmb: `${i + 5}元`,
                money: `${i}部门→${i + 1}部门→${i + 2}部门`,
                time: 2022 - 1 - 11,
            })
        }
        setList(arr);
    }

    const columns: ColumnsType<any> = [
        {
            width: 50,
            dataIndex: 'id',
            key: 'id',
            title: 'ID',
        },
        {
            width: 50,
            dataIndex: 'province',
            key: 'province',
            title: '省份',
        },
        {
            width: 50,
            dataIndex: 'area',
            key: 'area',
            title: '市区',
        },
        {
            width: 50,
            dataIndex: 'career',
            key: 'career',
            title: '职业',
        },
        {
            width: 50,
            dataIndex: 'name',
            key: 'name',
            title: '姓名',
        },
        {
            width: 50,
            dataIndex: 'state',
            key: 'state',
            title: '状态',
        },
        {
            width: 50,
            dataIndex: 'rmb',
            key: 'rmb',
            title: '金额',
        },
        {
            width: 100,
            dataIndex: 'name',
            key: 'name',
            title: '姓名',
        },
        {
            width: 80,
            dataIndex: 'money',
            key: 'money',
            title: '资金流向',
        },
        {
            width: 80,
            dataIndex: 'time',
            key: 'time',
            title: '资金时间',
        },
    ];

    function onExportBasicExcel() {
      // 创建工作簿
      const workbook = new ExcelJs.Workbook();
      // 添加sheet
      const worksheet = workbook.addWorksheet('demo sheet');
      // 设置 sheet 的默认行高
      worksheet.properties.defaultRowHeight = 20;
      // 设置列
      worksheet.columns = generateHeaders(columns);
      // 添加行
      worksheet.addRows(list);
      console.log(10)
      // 导出excel
      saveWorkbook(workbook, 'simple-demo.xlsx');
      console.log(20)

    }

    function onExportBasicExcelLater() {
        // 创建工作簿
        const formData = { columns, list }; // 只传递需要的数据
        const worker = new Worker('exportWorker.js');
        // 向Web Worker发送消息，告诉它开始处理导出任务
        worker.postMessage({action: 'exportFormData',formData});
        // 监听Web Worker的响应消息
        worker.addEventListener('message', (event) => {
            console.log(10)
            if (event.data.action === 'exportComplete') {
                // 导出完成后，处理导出文件
                const excelBuffer = event.data.excelBuffer;
                // 创建一个下载链接并触发下载
                const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'largeFile.xlsx';
                a.click();
                // 释放资源
                URL.revokeObjectURL(url);
                // 终止Web Worker
                worker.terminate();
            }
        })
    }


    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        console.log(selectedRows)
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    return (
        <Card>
            <h3>简单表格</h3>
            <Space style={{marginBottom: 10}}>
                <Button id="exportButton" type={'primary'} onClick={onExportBasicExcel}>优化前导出excel</Button>
                <Button id="exportButtonLater" type={'primary'}
                        onClick={onExportBasicExcelLater}>优化后导出excel</Button>
            </Space>
            <Table
                rowKey='id'
                rowSelection={rowSelection}
                columns={columns}
                dataSource={list}
            />
        </Card>

    );
}

export default SimpleDemo
