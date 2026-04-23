from docx import Document
import re
import fitz

def calculate_base_metrics( text_blocks: list[str]):
        full_text = "\n".join(text_blocks)
        words = re.findall(r"\b\w+\b", full_text)
        word_cnt = len(words)
        para_cnt = len(text_blocks)

        avg_words_per_para = round(word_cnt/para_cnt)

        return {
            "raw_text": full_text,
            "word_count": word_cnt,
            "paragraph_count": para_cnt,
            "avg_words_per_paragraph": avg_words_per_para,
        }

def parse( file_path:str, type: str):
    if type == "pdf":
        doc = fitz.open(file_path)
        text_blocks = []
        heading_count = 0

        font_sizes = []
        for page in doc:
            for block in page.get_text('dict').get("blocks",[]):
                if block.get("type") == 0:
                    for line in block.get("lines",[]):
                        for span in line.get("spans",[]):
                            font_sizes.append(round(span.get("size")))
        base_size = max(set(font_sizes),key=font_sizes.count) if font_sizes else 12
        for page in doc:
            for block in page.get_text("dict").get("blocks", []):
                if block.get("type") == 0:
                    block_text = ""
                    is_heading = False
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            block_text += span.get("text") + " "
                            if span["size"] > base_size + 1.5 or "bold" in span["font"].lower():
                                is_heading = True
                    cleaned_text = block_text.strip()
                    if cleaned_text:
                        text_blocks.append(cleaned_text)
                        if is_heading and len(cleaned_text.split()) < 15:
                            heading_count += 1
        metrics = calculate_base_metrics(text_blocks)
        metrics["heading_count"] = heading_count
        metrics["total_pages"] = len(doc)
        return metrics
    elif type == "docx":
        doc = Document(file_path)
        text_blocks = []
        heading_count = 0
        for para in doc.paragraphs:
            cleaned_text = para.text.strip()
            if cleaned_text:
                text_blocks.append(cleaned_text)    
                if para.style.name.startswith("Heading") or para.style.name.startswith("Title"):
                    heading_count += 1
        metrics = calculate_base_metrics(text_blocks)
        estimated_pages = max(1, metrics["word_count"] // 300)
        metrics["heading_count"] = heading_count
        metrics["total_pages"] = estimated_pages
        return metrics