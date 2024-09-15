<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;
class UpdatePaymentStatusRequest extends FormRequest
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
            'trang_thai_thanh_toan' => 'required|in:chua_thanh_toan,da_thanh_toan,dang_xu_ly,da_huy',
        ];
    }

    public function messages()
    {
        return [
            'trang_thai_thanh_toan.required' => 'Trạng thái thanh toán là bắt buộc.',
            'trang_thai_thanh_toan.in' => 'Trạng thái thanh toán không hợp lệ.',
        ];
    }

    protected function failedValidation(ValidationValidator $validator)
    {
        $error = $validator->errors();

        $response = response()->json(
            [
                'error' => $error->messages()
            ],
            Response::HTTP_UNPROCESSABLE_ENTITY
        );
        throw new HttpResponseException($response);
    }
}
