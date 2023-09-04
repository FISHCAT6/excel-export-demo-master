

// import ExcelJs from 'exceljs';


 function generateHeaders(columns) {
    return columns?.map(col => {
        const obj= {
            // 显示的 name
            header: col.title,
            // 用于数据匹配的 key
            key: col.dataIndex,
            // 列宽
            width: col.width / 5 || DEFAULT_COLUMN_WIDTH,
        };
        if (col.children) {
            obj.children = col.children?.map((item) => ({
                key: item.dataIndex,
                header: item.title,
                width: item.width,
                parentKey: col.dataIndex,
            }));
        }
        return obj;
    })
}

self.addEventListener('message', (event) => {
    console.log(22222);
    if (event.data.action === 'exportFormData') {
        importScripts('https://g.alicdn.com/code/lib/xlsx/0.17.4/xlsx.full.min.js');
        // 处理表单数据
        const { columns, list } = event.data.formData; // 解构赋值
        // 创建工作簿
        const workbook = XLSX.utils.book_new();

        // 生成列头
        const headers = generateHeaders(columns);
        const ws = XLSX.utils.json_to_sheet([{ ...headers }], { skipHeader: true });

        // 将数据添加到工作表
        XLSX.utils.sheet_add_json(ws, list, { origin: 'A2' });

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(workbook, ws, 'demo sheet');

        // 将工作簿转换为二进制数据
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', mimeType: 'application/octet-stream' });

        // 将二进制数据发送回主线程
        self.postMessage({ action: 'exportComplete', excelBuffer });
    }
});
