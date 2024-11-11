<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidateKhoangNgayNhapRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'ngay_bat_dau' => 'nullable|date|before_or_equal:ngay_ket_thuc|before_or_equal:now',
            'ngay_ket_thuc' => 'nullable|date|after_or_equal:ngay_bat_dau|before_or_equal:now',
        ];
    }

    public function messages()
    {
        return [
            'ngay_bat_dau.date' => 'Ngày bắt đầu không đúng định dạng.',
            'ngay_bat_dau.before_or_equal' => 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc và không được vượt quá thời gian hiện tại.',
            'ngay_ket_thuc.date' => 'Ngày kết thúc không đúng định dạng.',
            'ngay_ket_thuc.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'ngay_ket_thuc.before_or_equal' => 'Ngày kết thúc không được vượt quá thời gian hiện tại.',
        ];
    }
}
