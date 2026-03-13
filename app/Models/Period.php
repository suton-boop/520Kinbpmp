<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Period extends Model
{
    use HasFactory;

    protected $fillable = ['month_year'];

    public function reportSubmissions()
    {
        return $this->hasMany(ReportSubmission::class);
    }
}

