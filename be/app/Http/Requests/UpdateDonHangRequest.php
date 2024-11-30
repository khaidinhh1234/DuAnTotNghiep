<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class UpdateDonHangRequest extends FormRequest
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
            'id' => 'required|array',
            'trang_thai_don_hang' => 'required',
            'ly_do_huy' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'trang_thai_don_hang.required' => 'Trạng thái đơn hàng là bắt buộc.',
            'trang_thai_don_hang.in' => 'Trạng thái đơn hàng không hợp lệ.',
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
