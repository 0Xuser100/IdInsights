import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()


def fix_ocr_text(extracted_text: str) -> str:
    """Use OpenAI to fix OCR errors in Arabic text from Egyptian ID cards."""

    prompt = f"""أنت مساعد متخصص في تصحيح نصوص OCR لبطاقات الرقم القومي المصرية (جمهوريه مصر العربيه).

المهمة: تصحيح أخطاء OCR في النص المستخرج من بطاقة الرقم القومي المصرية.

قواعد التصحيح:
1. فصل الكلمات الملتصقة (مثل: "جمهوريهمصل" → "جمهوريه مصر")
2. تصحيح الأخطاء الإملائية الشائعة
3. الحفاظ على الأرقام والتواريخ كما هي
4. لا تضف معلومات غير موجودة في النص الأصلي

النص المستخرج:
{extracted_text}

أرجع النص المصحح فقط بدون شرح."""

    response = client.responses.create(
        model="gpt-4.1-nano-2025-04-14",
        input=prompt
    )

    return response.output_text


def extract_id_fields(corrected_text: str) -> dict:
    """Use OpenAI to extract structured fields from corrected ID card text."""

    prompt = f"""أنت مساعد متخصص في استخراج بيانات بطاقات الرقم القومي المصرية.

المهمة: استخراج البيانات التالية من النص وإرجاعها بصيغة JSON:

الحقول المطلوبة:
- name: الاسم الكامل
- national_id: الرقم القومي (14 رقم)
- address: العنوان الكامل
- date_of_birth: تاريخ الميلاد
- gender: النوع (ذكر/أنثى)
- religion: الديانة
- marital_status: الحالة الزوجية
- expiry_date: تاريخ انتهاء البطاقة (ساريه حتي)
- job: الوظيفة/المهنة

النص:
{corrected_text}

أرجع JSON فقط بدون أي نص إضافي. إذا لم يتوفر حقل، اتركه فارغاً (null)."""

    response = client.responses.create(
        model="gpt-5",
        input=prompt
    )

    try:
        result = json.loads(response.output_text)
        return result
    except json.JSONDecodeError:
        text = response.output_text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return json.loads(text.strip())
