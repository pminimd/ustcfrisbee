import fs from "node:fs";
import path from "node:path";

const QR_NAME = "加群二维码.png";

export function QrBlock() {
  const p = path.join(process.cwd(), "assets", QR_NAME);
  if (!fs.existsSync(p)) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200/80 bg-amber-50/60 px-5 py-8 text-center">
        <p className="text-sm font-medium text-stone-700">暂未找到二维码图片</p>
        <p className="mt-2 text-xs leading-relaxed text-stone-500">
          请将微信群二维码保存为「{QR_NAME}」，放入项目根目录下的{" "}
          <span className="font-medium text-stone-700">assets</span>{" "}
          文件夹，保存后刷新本页即可显示。
        </p>
      </div>
    );
  }

  const ext = path.extname(p).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : "image/png";
  const base64 = fs.readFileSync(p).toString("base64");

  return (
    // eslint-disable-next-line @next/next/no-img-element -- 可选本地资源，运行时读取
    <img
      alt="微信群二维码"
      src={`data:${mime};base64,${base64}`}
      className="mx-auto max-w-[220px] rounded-xl border border-stone-200/90 bg-white p-2 shadow-[0_14px_36px_-14px_rgba(82,56,36,0.2)]"
    />
  );
}
