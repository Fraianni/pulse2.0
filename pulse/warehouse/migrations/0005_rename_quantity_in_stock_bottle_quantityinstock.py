# Generated by Django 5.1.3 on 2024-11-30 23:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0004_remove_bottle_quantity_bottle_quantity_in_stock_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bottle',
            old_name='quantity_in_stock',
            new_name='quantityInStock',
        ),
    ]
