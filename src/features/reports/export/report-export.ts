import type { ReportColumn, ReportExportPayload, TableRow } from '@/pages/information/report/model/report.types'

const PDF_WIDTH = 1120
const BASE_ROW_HEIGHT = 32
const MAX_ROWS_IN_RENDER = 400

export async function exportReportToPdf(payload: ReportExportPayload) {
    const rows = flattenRows(payload.rows).slice(0, MAX_ROWS_IN_RENDER)
    const height = Math.max(760, 150 + rows.length * BASE_ROW_HEIGHT + 120)
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = PDF_WIDTH * scale
    canvas.height = height * scale

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(scale, scale)
    drawPdfReport(ctx, payload, rows, height)

    const jpeg = canvas.toDataURL('image/jpeg', 0.95)
    const pdfBlob = createSingleImagePdf(jpeg, canvas.width, canvas.height, PDF_WIDTH, height)
    await saveBlob(pdfBlob, `${sanitizeFileName(payload.title)}.pdf`, {
        description: 'PDF',
        accept: { 'application/pdf': ['.pdf'] },
    })
}

export async function exportReportToExcel(payload: ReportExportPayload) {
    const rows = flattenRows(payload.rows)
    const html = `
        <!doctype html>
        <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { border-collapse: collapse; width: 100%; }
                    th {
                        background: #000;
                        color: #fff;
                        font-weight: 700;
                        border: 1px solid #808080;
                        padding: 5px 8px;
                    }
                    td {
                        border: 1px solid #bfbfbf;
                        padding: 5px 8px;
                        mso-number-format: "\\@";
                    }
                    .money { text-align: right; }
                    .negative { color: #d81e06; }
                    .title { font-weight: 700; font-size: 16px; }
                    .period { font-weight: 700; }
                    .summary-label { font-weight: 700; }
                    .summary-value { font-weight: 700; text-align: right; }
                </style>
            </head>
            <body>
                <table>
                    <tr><td class="title" colspan="${payload.columns.length}">${escapeHtml(payload.title)}</td></tr>
                    <tr><td class="period" colspan="${payload.columns.length}">${escapeHtml(payload.rangeLabel)}</td></tr>
                    <tr></tr>
                    <tr>
                        ${payload.columns.map(column => `<th>${escapeHtml(column.label)}</th>`).join('')}
                    </tr>
                    ${rows.map(row => buildExcelRow(row, payload.columns)).join('')}
                    <tr></tr>
                    <tr>
                        <td class="summary-label" colspan="${Math.max(payload.columns.length - 1, 1)}">Итого:</td>
                        <td class="summary-value">${escapeHtml(payload.summary.total)}</td>
                    </tr>
                    <tr>
                        <td colspan="${Math.max(payload.columns.length - 1, 1)}">Приход:</td>
                        <td class="money">${escapeHtml(payload.summary.income)}</td>
                    </tr>
                    <tr>
                        <td colspan="${Math.max(payload.columns.length - 1, 1)}">Расход:</td>
                        <td class="money">${escapeHtml(payload.summary.expense)}</td>
                    </tr>
                </table>
            </body>
        </html>
    `
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' })
    await saveBlob(blob, `${sanitizeFileName(payload.title)}.xls`, {
        description: 'Excel',
        accept: { 'application/vnd.ms-excel': ['.xls'] },
    })
}

function buildExcelRow(row: TableRow, columns: ReportColumn[]) {
    return `
        <tr>
            ${columns.map((column, index) => {
                const value = formatCellValue(row[column.prop])
                const classes = [
                    column.money ? 'money' : '',
                    column.money && isNegative(value) ? 'negative' : '',
                ].filter(Boolean).join(' ')
                const indent = index === 0 ? `padding-left:${getDepth(row) * 16 + 8}px` : ''

                return `<td class="${classes}" style="${indent}">${escapeHtml(value)}</td>`
            }).join('')}
        </tr>
    `
}

function flattenRows(rows: TableRow[], depth = 0): TableRow[] {
    return rows.flatMap(row => {
        const current = { ...row, __depth: depth }
        const children = Array.isArray(row.children) ? flattenRows(row.children, depth + 1) : []

        return [current, ...children]
    })
}

function getDepth(row: TableRow) {
    const depth = Number(row.__depth)

    return Number.isFinite(depth) ? depth : 0
}

function formatCellValue(value: unknown) {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value

    return String(value)
}

function escapeHtml(value: unknown) {
    return formatCellValue(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

function isNegative(value: unknown) {
    return String(value ?? '').trim().startsWith('-')
}

function sanitizeFileName(value: string) {
    return value.replace(/[\\/:*?"<>|]+/g, '_').trim() || 'report'
}

function drawPdfReport(ctx: CanvasRenderingContext2D, payload: ReportExportPayload, rows: TableRow[], height: number) {
    const margin = 24
    const tableWidth = PDF_WIDTH - margin * 2
    const columnWidths = getColumnWidths(payload.columns, tableWidth)
    let y = 34

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, PDF_WIDTH, height)
    ctx.fillStyle = '#000000'
    ctx.textBaseline = 'middle'
    ctx.font = '700 24px Arial'
    drawAlignedText(ctx, payload.title, margin, y, tableWidth, 'center')

    y += 28
    ctx.font = '13px Arial'
    ctx.fillStyle = '#334155'
    drawAlignedText(ctx, payload.rangeLabel, margin, y, tableWidth, 'center')

    y += 28
    drawTableHeader(ctx, payload.columns, columnWidths, margin, y)
    y += BASE_ROW_HEIGHT

    rows.forEach(row => {
        drawTableRow(ctx, row, payload.columns, columnWidths, margin, y)
        y += BASE_ROW_HEIGHT
    })

    y += 16
    ctx.fillStyle = '#000000'
    ctx.font = '700 16px Arial'
    ctx.fillText('Итого:', margin + 6, y)
    drawAlignedText(ctx, payload.summary.total, margin, y, tableWidth - 8, 'right')

    y += 24
    ctx.font = '16px Arial'
    drawAlignedText(ctx, `Приход: ${payload.summary.income}`, margin, y, tableWidth - 8, 'right')
    y += 24
    drawAlignedText(ctx, `Расход: ${payload.summary.expense}`, margin, y, tableWidth - 8, 'right')
}

function drawTableHeader(ctx: CanvasRenderingContext2D, columns: ReportColumn[], widths: number[], x: number, y: number) {
    let currentX = x

    ctx.font = '16px Arial'
    columns.forEach((column, index) => {
        ctx.fillStyle = '#b6b6b6'
        ctx.fillRect(currentX, y, widths[index], BASE_ROW_HEIGHT)
        ctx.strokeStyle = '#bcbcbc'
        ctx.strokeRect(currentX, y, widths[index], BASE_ROW_HEIGHT)
        ctx.fillStyle = '#000000'
        drawAlignedText(ctx, column.label, currentX + 8, y + BASE_ROW_HEIGHT / 2, widths[index] - 16, column.align ?? 'left')
        currentX += widths[index]
    })
}

function drawTableRow(ctx: CanvasRenderingContext2D, row: TableRow, columns: ReportColumn[], widths: number[], x: number, y: number) {
    let currentX = x

    ctx.font = '16px Arial'
    columns.forEach((column, index) => {
        const value = formatPdfCellValue(row[column.prop], column.prop)
        const indent = index === 0 ? getDepth(row) * 18 : 0
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(currentX, y, widths[index], BASE_ROW_HEIGHT)
        ctx.strokeStyle = '#c9c9c9'
        ctx.strokeRect(currentX, y, widths[index], BASE_ROW_HEIGHT)
        ctx.fillStyle = column.money && isNegative(value) ? '#d81e06' : '#000000'
        drawAlignedText(ctx, value, currentX + 8 + indent, y + BASE_ROW_HEIGHT / 2, widths[index] - 16 - indent, column.align ?? 'left')
        currentX += widths[index]
    })
}

function getColumnWidths(columns: ReportColumn[], tableWidth: number) {
    const fixedWidth = columns.reduce((sum, column) => sum + (typeof column.width === 'number' ? column.width : 0), 0)
    const flexibleCount = columns.filter(column => typeof column.width !== 'number').length || 1
    const flexibleWidth = Math.max((tableWidth - fixedWidth) / flexibleCount, 120)

    return columns.map(column => typeof column.width === 'number' ? column.width : flexibleWidth)
}

function drawAlignedText(
    ctx: CanvasRenderingContext2D,
    value: string,
    x: number,
    y: number,
    width: number,
    align: 'left' | 'center' | 'right',
) {
    const text = fitText(ctx, value, width)
    const offset = align === 'right' ? width : align === 'center' ? width / 2 : 0

    ctx.textAlign = align
    ctx.fillText(text, x + offset, y)
    ctx.textAlign = 'left'
}

function fitText(ctx: CanvasRenderingContext2D, value: string, maxWidth: number) {
    if (ctx.measureText(value).width <= maxWidth) return value

    let fitted = value
    while (fitted.length > 1 && ctx.measureText(`${fitted}...`).width > maxWidth) {
        fitted = fitted.slice(0, -1)
    }

    return `${fitted}...`
}

function formatPdfCellValue(value: unknown, prop: string) {
    const formatted = formatCellValue(value)
    if (prop !== 'payment_date') return formatted

    const [year, month, day] = formatted.split('-')
    if (!year || !month || !day) return formatted

    return `${day}.${month}.${year}`
}

interface SaveDialogFileType {
    description: string
    accept: Record<string, string[]>
}

interface BrowserSaveFileHandle {
    createWritable: () => Promise<{
        write: (data: Blob) => Promise<void>
        close: () => Promise<void>
    }>
}

async function saveBlob(blob: Blob, fileName: string, fileType: SaveDialogFileType) {
    const saveFilePicker = (window as typeof window & {
        showSaveFilePicker?: (options: {
            suggestedName: string
            types: SaveDialogFileType[]
        }) => Promise<BrowserSaveFileHandle>
    }).showSaveFilePicker

    if (saveFilePicker) {
        const handle = await saveFilePicker({
            suggestedName: fileName,
            types: [fileType],
        })
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
        return
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
}

function createSingleImagePdf(imageDataUrl: string, width: number, height: number, pageWidthPx: number, pageHeightPx: number) {
    const imageBinary = atob(imageDataUrl.split(',')[1] ?? '')
    const pageWidth = pageWidthPx * 0.75
    const pageHeight = pageHeightPx * 0.75
    const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im1 Do\nQ`
    const objects = [
        '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
        '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
        `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
        `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBinary.length} >>\nstream\n${imageBinary}\nendstream\nendobj\n`,
        `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
    ]
    let pdf = '%PDF-1.4\n'
    const offsets = [0]

    for (const object of objects) {
        offsets.push(pdf.length)
        pdf += object
    }

    const xrefOffset = pdf.length
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
    pdf += offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

    return new Blob([binaryStringToUint8Array(pdf)], { type: 'application/pdf' })
}

function binaryStringToUint8Array(value: string) {
    const bytes = new Uint8Array(value.length)

    for (let index = 0; index < value.length; index += 1) {
        bytes[index] = value.charCodeAt(index) & 0xff
    }

    return bytes
}
