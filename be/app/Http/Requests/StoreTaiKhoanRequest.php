<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaiKhoanRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'ho' => 'required|string|max:255',
            'ten' => 'required|string|max:255',
            'anh_nguoi_dung' => 'nullable',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'so_dien_thoai' => 'nullable|string|max:15',
            'dia_chi' => 'nullable|string',
            'ngay_sinh' => 'nullable|date',
            'gioi_tinh' => 'nullable|in:1,2,3',
            'vai_tros' => 'array'
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