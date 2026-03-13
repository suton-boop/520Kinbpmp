use App\Models\GugusMutu;

GugusMutu::truncate();

$items = [
    'GM1-PAUD',
    'GM2-SD',
    'GM3-SMP',
    'GM4-SMA',
    'GM5- UMUM'
];

foreach ($items as $item) {
    if(!GugusMutu::where('name', $item)->exists()){
        GugusMutu::create(['name' => $item]);
    }
}

echo "Gugus Mutu updated.\n";
